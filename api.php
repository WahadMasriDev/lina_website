<?php
// ============================================================
//  NAFAS Tracker — api.php
//  CHANGELOG
//  v3 (2026-06-13) — Snapshots now store an "action" label so
//                    history shows what was done, not just when.
//                    Open/close card no longer triggers a save.
//  v2 (2026-06-13) — Real credentials, dbping, detailed errors,
//                    changelog table, restore endpoint.
//  v1 (2026-06-13) — Initial release.
// ============================================================

// DB credentials come from environment variables. On Docker/Portainer, set
// them as compose/stack environment variables. On plain hosting (Hostinger)
// without an env-var panel, copy env.local.php.example to env.local.php,
// fill in the real values, and upload it alongside this file — it's
// git-ignored, so it never ends up in this (public) repo.
if (file_exists(__DIR__ . '/env.local.php')) {
    require __DIR__ . '/env.local.php';
}

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: '');
define('DB_USER', getenv('DB_USER') ?: '');
define('DB_PASS', getenv('DB_PASS') ?: '');

if (DB_NAME === '' || DB_USER === '') {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' =>
        'Database not configured. Set DB_HOST/DB_NAME/DB_USER/DB_PASS as ' .
        'environment variables, or create env.local.php from ' .
        'env.local.php.example.']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$action = $_GET['action'] ?? '';

// ── quick ping ────────────────────────────────────────────────
if ($action === 'ping') {
    echo json_encode(['ok'=>true,'php'=>phpversion()]); exit;
}

// ── connect ──────────────────────────────────────────────────
try {
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
         PDO::ATTR_TIMEOUT=>5]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'DB connection failed','detail'=>$e->getMessage()]);
    exit;
}

if ($action === 'dbping') {
    echo json_encode(['ok'=>true,'message'=>'Database connected ✓']); exit;
}

// ── bootstrap tables ─────────────────────────────────────────
$pdo->exec("
    CREATE TABLE IF NOT EXISTS nafas_state (
        id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        state_key   VARCHAR(64)  NOT NULL,
        state_value MEDIUMTEXT   NOT NULL,
        updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_key (state_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

// v3: added `action_label` column to changelog
$pdo->exec("
    CREATE TABLE IF NOT EXISTS nafas_changelog (
        id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        saved_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        action_label VARCHAR(255) NOT NULL DEFAULT 'Manual save',
        state_json   MEDIUMTEXT   NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

// Add action_label column if upgrading from v2 (safe to run multiple times)
try {
    $pdo->exec("ALTER TABLE nafas_changelog ADD COLUMN action_label VARCHAR(255) NOT NULL DEFAULT 'Manual save' AFTER saved_at");
} catch (PDOException $e) { /* column already exists — ignore */ }

// ═══════════════════════════════ ROUTES

// GET load
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'load') {
    $stmt = $pdo->prepare("SELECT state_value, updated_at FROM nafas_state WHERE state_key='main'");
    $stmt->execute();
    $row = $stmt->fetch();
    echo json_encode($row
        ? ['ok'=>true,'data'=>json_decode($row['state_value'],true),'updated_at'=>$row['updated_at']]
        : ['ok'=>true,'data'=>null]);
    exit;
}

// POST save  — body: { state:{…}, action:"Checked off X in Card Y" }
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'save') {
    $body    = file_get_contents('php://input');
    $payload = json_decode($body, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($payload)) {
        http_response_code(400);
        echo json_encode(['ok'=>false,'error'=>'Invalid JSON']);
        exit;
    }

    $stateData   = $payload['state']  ?? $payload;         // backwards-compat
    $actionLabel = trim($payload['action'] ?? 'Updated');
    if ($actionLabel === '') $actionLabel = 'Updated';

    $json = json_encode($stateData, JSON_UNESCAPED_UNICODE);

    // upsert main state
    $pdo->prepare("
        INSERT INTO nafas_state (state_key, state_value) VALUES ('main',:v)
        ON DUPLICATE KEY UPDATE state_value=:v, updated_at=CURRENT_TIMESTAMP
    ")->execute([':v'=>$json]);

    // write changelog entry
    $pdo->prepare("
        INSERT INTO nafas_changelog (action_label, state_json) VALUES (?,?)
    ")->execute([$actionLabel, $json]);

    // keep last 50 snapshots
    $pdo->exec("
        DELETE FROM nafas_changelog
        WHERE id NOT IN (
            SELECT id FROM (SELECT id FROM nafas_changelog ORDER BY id DESC LIMIT 50) k
        )
    ");

    echo json_encode(['ok'=>true,'saved_at'=>date('c'),'action'=>$actionLabel]);
    exit;
}

// GET history
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'history') {
    $rows = $pdo->query("SELECT id, saved_at, action_label FROM nafas_changelog ORDER BY id DESC LIMIT 50")->fetchAll();
    echo json_encode(['ok'=>true,'snapshots'=>$rows]);
    exit;
}

// GET restore&id=N
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'restore') {
    $id   = intval($_GET['id'] ?? 0);
    $stmt = $pdo->prepare("SELECT state_json, action_label FROM nafas_changelog WHERE id=?");
    $stmt->execute([$id]);
    $snap = $stmt->fetch();
    if (!$snap) { http_response_code(404); echo json_encode(['ok'=>false,'error'=>'Snapshot not found']); exit; }
    $pdo->prepare("
        INSERT INTO nafas_state (state_key,state_value) VALUES ('main',:v)
        ON DUPLICATE KEY UPDATE state_value=:v, updated_at=CURRENT_TIMESTAMP
    ")->execute([':v'=>$snap['state_json']]);
    // log the restore itself
    $pdo->prepare("INSERT INTO nafas_changelog (action_label,state_json) VALUES (?,?)")
        ->execute(["Restored to snapshot #{$id}: {$snap['action_label']}", $snap['state_json']]);
    echo json_encode(['ok'=>true,'restored_id'=>$id]);
    exit;
}

http_response_code(404);
echo json_encode(['ok'=>false,'error'=>'Unknown action: '.htmlspecialchars($action)]);
