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
const search = ref('')
const copiedCmd = ref('')

const categories = [
  {
    id: 'basics',
    name: '基礎操作',
    icon: ['fas', 'seedling'],
    commands: [
      { command: 'git init', desc: '在當前目錄初始化一個新的 Git 儲存庫' },
      { command: 'git clone <url>', desc: '克隆遠端儲存庫到本地' },
      { command: 'git status', desc: '查看工作目錄與暫存區的狀態' },
      { command: 'git diff', desc: '比較工作目錄與暫存區的差異' },
      { command: 'git diff --staged', desc: '比較暫存區與最新提交的差異' },
      { command: 'git log', desc: '查看提交歷史記錄' },
      { command: 'git log --oneline', desc: '以單行簡潔格式顯示提交記錄' },
      { command: 'git log --graph', desc: '以圖形化方式顯示分支結構' },
    ],
  },
  {
    id: 'staging',
    name: '暫存與提交',
    icon: ['fas', 'floppy-disk'],
    commands: [
      { command: 'git add .', desc: '將所有變更加入暫存區' },
      { command: 'git add <file>', desc: '將指定檔案加入暫存區' },
      { command: 'git add -p', desc: '互動式選擇要暫存的區塊' },
      { command: 'git commit -m "<msg>"', desc: '提交暫存區的內容並附上訊息' },
      { command: 'git commit --amend', desc: '修改最後一次提交的訊息或內容' },
      { command: 'git reset HEAD <file>', desc: '將檔案從暫存區移出（不影響工作目錄）' },
      { command: 'git restore <file>', desc: '捨棄工作目錄中的變更' },
      { command: 'git restore --staged <file>', desc: '將暫存區的檔案移回工作目錄' },
    ],
  },
  {
    id: 'branch',
    name: '分支管理',
    icon: ['fas', 'code-branch'],
    commands: [
      { command: 'git branch', desc: '列出所有本地分支' },
      { command: 'git branch -a', desc: '列出所有本地與遠端分支' },
      { command: 'git branch <name>', desc: '建立新分支（不切換）' },
      { command: 'git checkout -b <name>', desc: '建立並切換到新分支' },
      { command: 'git switch <name>', desc: '切換到指定分支' },
      { command: 'git branch -d <name>', desc: '刪除已合併的分支' },
      { command: 'git branch -D <name>', desc: '強制刪除分支（即使未合併）' },
      { command: 'git merge <branch>', desc: '將指定分支合併到當前分支' },
      { command: 'git merge --no-ff <branch>', desc: '合併並保留合併節點（不快轉）' },
      { command: 'git rebase <branch>', desc: '將當前分支的提交移到指定分支之後' },
    ],
  },
  {
    id: 'remote',
    name: '遠端操作',
    icon: ['fas', 'cloud'],
    commands: [
      { command: 'git remote -v', desc: '查看所有遠端儲存庫設定' },
      { command: 'git remote add origin <url>', desc: '新增名為 origin 的遠端儲存庫' },
      { command: 'git fetch', desc: '抓取遠端所有更新（不合併）' },
      { command: 'git fetch <remote>', desc: '抓取指定遠端的更新' },
      { command: 'git pull', desc: '抓取遠端更新並合併到當前分支' },
      { command: 'git pull --rebase', desc: '抓取遠端更新並以 rebase 方式整合' },
      { command: 'git push origin <branch>', desc: '推送本地分支到遠端' },
      { command: 'git push -u origin <branch>', desc: '推送並設定上游追蹤分支' },
      { command: 'git push --force-with-lease', desc: '安全的強制推送（遠端有新提交則拒絕）' },
    ],
  },
  {
    id: 'advanced',
    name: '進階操作',
    icon: ['fas', 'wand-magic-sparkles'],
    commands: [
      { command: 'git stash', desc: '暫存當前所有未提交的變更' },
      { command: 'git stash pop', desc: '取出最近一次暫存並應用' },
      { command: 'git stash list', desc: '列出所有暫存記錄' },
      { command: 'git stash drop', desc: '刪除最近一次暫存記錄' },
      { command: 'git reset --soft HEAD~1', desc: '撤銷最後一次提交，保留所有變更在暫存區' },
      { command: 'git reset --mixed HEAD~1', desc: '撤銷最後一次提交，變更回到工作目錄' },
      { command: 'git reset --hard HEAD~1', desc: '撤銷最後一次提交並丟棄所有變更（危險）' },
      { command: 'git revert <commit>', desc: '建立一個新提交來撤銷指定提交（保留歷史）' },
      { command: 'git cherry-pick <commit>', desc: '將指定提交應用到當前分支' },
      { command: 'git tag <name>', desc: '在當前提交建立輕量標籤' },
      { command: 'git tag -a <name> -m "<msg>"', desc: '建立附帶訊息的附註標籤' },
    ],
  },
]

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
