<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <!-- Hero -->
    <div class="text-center space-y-3">
      <div class="flex justify-center">
        <img src="@/assets/git.png" alt="Git Logo" class="h-16 w-16" />
      </div>
      <h1 class="text-2xl md:text-3xl font-bold">Yes, It's Git</h1>
      <p class="text-base-content/60">
        一個簡化 Git 操作的網頁工具，透過互動式表單自動產生正確的 Git 指令，一鍵複製即可使用。
      </p>
      <a
        href="https://github.com/Chlorophyll319/itsGit.github.io"
        target="_blank"
        class="btn btn-neutral btn-sm gap-2"
      >
        <FontAwesomeIcon :icon="['fab', 'github']" />
        GitHub
      </a>
    </div>

    <div class="divider"></div>

    <!-- Features -->
    <section class="space-y-3">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <FontAwesomeIcon :icon="['fas', 'star']" class="text-primary" />
        功能特色
      </h2>
      <div class="grid sm:grid-cols-2 gap-3">
        <div v-for="f in features" :key="f.title" class="card bg-base-200">
          <div class="card-body p-4 gap-1">
            <div class="flex items-center gap-2">
              <FontAwesomeIcon :icon="f.icon" class="text-primary" />
              <span class="font-semibold text-sm">{{ f.title }}</span>
            </div>
            <p class="text-sm text-base-content/60">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack -->
    <section class="space-y-3">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <FontAwesomeIcon :icon="['fas', 'cubes']" class="text-primary" />
        技術堆疊
      </h2>
      <div class="flex flex-wrap gap-2">
        <span v-for="tech in techStack" :key="tech" class="badge badge-outline">{{ tech }}</span>
      </div>
    </section>

    <!-- How to use -->
    <section class="space-y-3">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <FontAwesomeIcon :icon="['fas', 'circle-info']" class="text-primary" />
        使用方式
      </h2>
      <ol class="space-y-2">
        <li v-for="(step, i) in steps" :key="i" class="flex gap-3 items-start">
          <span class="badge badge-primary badge-sm shrink-0 mt-0.5">{{ i + 1 }}</span>
          <span class="text-sm text-base-content/80">{{ step }}</span>
        </li>
      </ol>
    </section>

    <div class="divider"></div>

    <footer class="text-center text-sm text-base-content/40 space-y-1">
      <p>© 2025 itsGit · MIT License</p>
      <p>
        參考資源：
        <a href="https://git-scm.com/doc" target="_blank" class="link link-hover">Git 官方文件</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
const features = [
  {
    icon: ['fas', 'wand-magic-sparkles'],
    title: '指令產生器',
    desc: '選擇操作類型，填入參數，自動組合出正確的 Git 指令',
  },
  {
    icon: ['fas', 'copy'],
    title: '一鍵複製',
    desc: '點擊按鈕即可複製指令，直接貼上終端機使用',
  },
  {
    icon: ['fas', 'book'],
    title: '速查表',
    desc: '常用 Git 指令分類整理，搜尋即找，方便查閱',
  },
  {
    icon: ['fas', 'clock-rotate-left'],
    title: '歷史記錄',
    desc: '自動保存複製過的指令，隨時翻閱重複使用',
  },
  {
    icon: ['fas', 'triangle-exclamation'],
    title: '危險指令警示',
    desc: '對 reset --hard、push --force 等操作給予明確警告',
  },
  {
    icon: ['fas', 'map'],
    title: '情境導向',
    desc: '10 種常見情境，直接查看建議指令步驟與說明',
  },
  {
    icon: ['fas', 'moon'],
    title: '深色主題',
    desc: '支援淺色 / 深色主題切換，護眼舒適',
  },
]

const techStack = [
  'Vue 3',
  'Vite',
  'TailwindCSS 4',
  'DaisyUI 5',
  'Pinia',
  'Vue Router',
  'FontAwesome',
  '@vueuse/core',
  'vee-validate + yup',
  'pinia-plugin-persistedstate',
]

const steps = [
  '在首頁選擇要執行的 Git 操作（Clone、Commit、Branch…）',
  '填寫對應的欄位，指令預覽區會即時更新',
  '確認無誤後點擊「複製指令」',
  '貼上到終端機執行',
]
</script>
