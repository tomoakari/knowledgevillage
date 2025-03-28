<script>
  import { onMount } from 'svelte';
  import { Circle3 } from 'svelte-loading-spinners';
  
  let query = '';
  let result = '';
  let loading = false;
  let error = '';
  
  async function handleSubmit() {
    if (!query.trim()) {
      error = '質問を入力してね！';
      return;
    }
    
    error = '';
    loading = true;
    result = '';
    
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error('APIリクエストに失敗したよ！');
      }
      
      const data = await response.json();
      result = data.result;
    } catch (err) {
      console.error('エラーが発生したよ:', err);
      error = 'エラーが発生したよ！もう一度試してみてね！';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto mt-8">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">GitHubのデータに質問してみよう！ 🔍</h2>
    
    <form on:submit|preventDefault={handleSubmit} class="mb-6">
      <div class="mb-4">
        <label for="query" class="block text-sm font-medium text-gray-700 mb-1">質問内容:</label>
        <textarea
          id="query"
          bind:value={query}
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="例: リポジトリの主な機能は何ですか？"
        ></textarea>
      </div>
      
      {#if error}
        <p class="text-red-500 text-sm mb-4">{error}</p>
      {/if}
      
      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        disabled={loading}
      >
        {#if loading}
          質問中...
        {:else}
          質問する
        {/if}
      </button>
    </form>
    
    {#if loading}
      <div class="flex justify-center my-8">
        <Circle3 size="60" color="#9333ea" unit="px" duration="1s" />
      </div>
    {:else if result}
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">回答:</h3>
        <div class="bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-line">
          {result}
        </div>
      </div>
    {/if}
  </div>
</div>