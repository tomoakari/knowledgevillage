<script>
  import '../app.css';
</script>

<div class="min-h-screen">
  <header class="bg-purple-600 text-white p-4 shadow-md">
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold">Knowledge Village 🏡</h1>
      <p class="text-sm">GitHubの知識を探索しよう！</p>
    </div>
  </header>

  <main class="container mx-auto p-4">
    <slot />
  </main>
  
  <footer class="bg-gray-100 text-center p-4 mt-8">
    <p class="text-gray-600 text-sm">© 2025 Knowledge Village - Powered by Gemma3</p>
  </footer>
</div>