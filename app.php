<?php

// This file handles all CRUD operations and communicates with the database.

header('Content-Type: application/json');
$pdo = new PDO('mysql:host=localhost;dbname=task_manager', 'root', '');

// Read Tasks
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT * FROM tasks');
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tasks);
    exit;
}

// Delete Task
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

// Create or Update Task
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  $title = htmlspecialchars($data['title']);
  $description = htmlspecialchars($data['description']);
  $id = $data['id'] ?? null;

  if ($id) {
      $stmt = $pdo->prepare('UPDATE tasks SET title = ?, description = ? WHERE id = ?');
      $stmt->execute([$title, $description, $id]);
  } else {
      $stmt = $pdo->prepare('INSERT INTO tasks (title, description) VALUES (?, ?)');
      $stmt->execute([$title, $description]);
  }

  echo json_encode(['success' => true]);
  exit;
}
