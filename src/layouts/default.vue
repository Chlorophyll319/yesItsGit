<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <!-- Mobile Menu -->
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <FontAwesomeIcon :icon="['fas', 'bars']" class="h-5 w-5" />
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><RouterLink to="/" class="router-link-active:font-bold">首頁</RouterLink></li>
            <li>
              <RouterLink to="/commands" class="router-link-active:font-bold">指令列表</RouterLink>
            </li>
            <li>
              <RouterLink to="/history" class="router-link-active:font-bold">歷史記錄</RouterLink>
            </li>
            <li><RouterLink to="/about" class="router-link-active:font-bold">關於</RouterLink></li>
          </ul>
        </div>

        <!-- Logo -->
        <RouterLink to="/" class="btn btn-ghost text-xl">
          <img src="@/assets/git.png" alt="Git Logo" class="h-6 w-6" />
          <span class="ml-2">Yes, It's Git</span>
        </RouterLink>
      </div>

      <!-- Desktop Menu -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><RouterLink to="/" class="router-link-active:font-bold">首頁</RouterLink></li>
          <li>
            <RouterLink to="/commands" class="router-link-active:font-bold">指令列表</RouterLink>
          </li>
          <li>
            <RouterLink to="/history" class="router-link-active:font-bold">歷史記錄</RouterLink>
          </li>
          <li><RouterLink to="/about" class="router-link-active:font-bold">關於</RouterLink></li>
        </ul>
      </div>

      <div class="navbar-end">
        <!-- Theme Toggle -->
        <label class="swap swap-rotate btn btn-ghost btn-circle">
          <input type="checkbox" class="theme-controller" @change="toggleTheme" />
          <FontAwesomeIcon :icon="['fas', 'sun']" class="swap-off h-5 w-5" />
          <FontAwesomeIcon :icon="['fas', 'moon']" class="swap-on h-5 w-5" />
        </label>

        <!-- GitHub Link -->
        <a
          href="https://github.com/Chlorophyll319/itsGit.github.io"
          target="_blank"
          class="btn btn-ghost btn-circle"
          aria-label="GitHub"
        >
          <FontAwesomeIcon :icon="['fab', 'github']" class="h-5 w-5" />
        </a>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-4 md:py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer footer-center bg-base-200 text-base-content p-10">
      <aside>
        <div class="flex items-center gap-3">
          <img src="@/assets/git.png" alt="Git Logo" class="h-12 w-12" />
          <p class="font-bold text-lg">Yes, It's Git - Git 指令輔助工具</p>
        </div>
        <p class="text-sm">讓 Git 操作更簡單、更直觀</p>
        <p class="text-xs opacity-70">© 2025 itsGit. All rights reserved.</p>
      </aside>

      <nav>
        <div class="grid grid-flow-col gap-4">
          <a
            href="https://github.com/Chlorophyll319/itsGit.github.io"
            target="_blank"
            class="link link-hover"
            aria-label="GitHub"
          >
            <FontAwesomeIcon :icon="['fab', 'github']" class="h-6 w-6" />
          </a>
          <a
            href="https://git-scm.com/doc"
            target="_blank"
            class="link link-hover"
            aria-label="Git Documentation"
          >
            <FontAwesomeIcon :icon="['fas', 'book']" class="h-6 w-6" />
          </a>
          <a href="mailto:support@example.com" class="link link-hover" aria-label="Email">
            <FontAwesomeIcon :icon="['fas', 'envelope']" class="h-6 w-6" />
          </a>
        </div>
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

// 初始化主題
onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light'
  isDark.value = theme === 'dark'
  document.documentElement.setAttribute('data-theme', theme)
})

// 切換主題
const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>
