<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl font-bold">Git 指令速查表</h1>
      <p class="mt-2 text-sm md:text-base text-base-content/60">快速查閱常用指令，點擊可一鍵複製</p>
    </div>

    <!-- Search -->
    <div class="max-w-md mx-auto">
      <label class="input input-bordered flex items-center gap-2">
        <FontAwesomeIcon :icon="['fas', 'magnifying-glass']" class="opacity-50" />
        <input
          v-model="search"
          type="text"
          placeholder="搜尋指令或說明..."
          class="grow"
        />
        <button v-if="search" @click="search = ''" class="opacity-50 hover:opacity-100">
          <FontAwesomeIcon :icon="['fas', 'xmark']" />
        </button>
      </label>
    </div>

    <!-- Results count when searching -->
    <div v-if="search" class="text-sm text-base-content/50 text-center">
      找到 {{ totalFiltered }} 筆結果
    </div>

    <!-- No results -->
    <div v-if="search && totalFiltered === 0" class="text-center py-12 text-base-content/30">
      <FontAwesomeIcon :icon="['fas', 'face-frown']" class="text-4xl mb-3" />
      <p class="text-lg font-medium">找不到「{{ search }}」相關指令</p>
    </div>

    <!-- Categories -->
    <div v-for="category in filteredCategories" :key="category.id" class="space-y-2">
      <div class="flex items-center gap-2">
        <FontAwesomeIcon :icon="category.icon" class="text-primary" />
        <h2 class="text-lg font-bold">{{ category.name }}</h2>
        <span class="badge badge-ghost badge-sm">{{ category.commands.length }}</span>
      </div>

      <div class="overflow-x-auto rounded-box border border-base-300">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th class="w-[45%]">指令</th>
              <th>說明</th>
              <th class="w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cmd in category.commands" :key="cmd.command" class="hover">
              <td>
                <code class="text-sm font-mono text-primary bg-base-200 px-2 py-0.5 rounded">{{ cmd.command }}</code>
              </td>
              <td class="text-sm text-base-content/80">{{ cmd.desc }}</td>
              <td>
                <button
                  class="btn btn-ghost btn-xs"
                  :class="copiedCmd === cmd.command ? 'text-success' : ''"
                  @click="copyCmd(cmd.command)"
                  title="複製指令"
                >
                  <FontAwesomeIcon :icon="copiedCmd === cmd.command ? ['fas', 'check'] : ['fas', 'copy']" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { categories } from '@/data/cheatsheet.js'

const search = ref('')
const copiedCmd = ref('')

const filteredCategories = computed(() => {
  if (!search.value.trim()) return categories
  const q = search.value.toLowerCase()
  return categories
    .map((cat) => ({
      ...cat,
      commands: cat.commands.filter(
        (cmd) => cmd.command.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q),
      ),
    }))
    .filter((cat) => cat.commands.length > 0)
})

const totalFiltered = computed(() => filteredCategories.value.reduce((sum, cat) => sum + cat.commands.length, 0))

const copyCmd = async (command) => {
  try {
    await navigator.clipboard.writeText(command)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = command
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copiedCmd.value = command
  setTimeout(() => (copiedCmd.value = ''), 1500)
}
</script>
