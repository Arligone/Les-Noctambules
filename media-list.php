<?php
header('Content-Type: application/json');

$dir = 'media/';

// Créer le dossier media s'il n'existe pas
if (!file_exists($dir)) {
    mkdir($dir, 0777, true);
}

// Récupérer la liste des fichiers
$files = array_diff(scandir($dir), array('.', '..'));
$images = array();

foreach ($files as $file) {
    $filePath = $dir . $file;
    // Vérifier si c'est un fichier et si c'est une image
    if (is_file($filePath) && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
        $images[] = array(
            'name' => $file,
            'date' => filemtime($filePath),
            'url' => $dir . $file
        );
    }
}

// Trier par date décroissante (plus récent en premier)
usort($images, function($a, $b) {
    return $b['date'] - $a['date'];
});

echo json_encode($images);
?> 