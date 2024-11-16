<?php
$primary_servers = [
    "http://cs455.000.pe/",
    "http://1cs455.000.pe/"
];

$backup_server = "http://cs455-backup.000.pe/";

function is_server_available($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return $http_code === 200;
}

session_start();
if (!isset($_SESSION['current_server_index'])) {
    $_SESSION['current_server_index'] = 0;
}

for ($i = 0; $i < count($primary_servers); $i++) {
    $server = $primary_servers[$_SESSION['current_server_index']];
    $_SESSION['current_server_index'] = ($_SESSION['current_server_index'] + 1) % count($primary_servers);

    if (is_server_available($server)) {
        header("Location: $server");
        exit;
    }
}
if (is_server_available($backup_server)) {
    header("Location: $backup_server");
    exit;
}

http_response_code(503);
echo "All servers are down. Please try again later.";

