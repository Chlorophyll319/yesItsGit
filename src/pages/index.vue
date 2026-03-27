<route lang="yaml">
meta:
  title: '首頁'
  login: ''
  admin: false
</route>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold">Git 指令產生器</h1>
      <p class="mt-2 text-base-content/60">選擇操作類型，填入參數，一鍵複製指令</p>
    </div>

    <!-- Operation Cards -->
    <div class="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      <button
        v-for="op in operations"
        :key="op.id"
        class="card cursor-pointer transition-all duration-200 p-3 flex flex-col items-center gap-2 hover:shadow-md"
        :class="selectedOp === op.id ? 'bg-primary text-primary-content shadow-md' : 'bg-base-200 hover:bg-base-300'"
        @click="selectOperation(op.id)"
      >
        <FontAwesomeIcon :icon="op.icon" class="text-xl" />
        <span class="text-xs font-semibold">{{ op.label }}</span>
      </button>
    </div>

    <!-- Form + Preview -->
    <div v-if="selectedOp" class="grid lg:grid-cols-2 gap-6">
      <!-- Dynamic Form -->
      <div class="card bg-base-200 shadow">
        <div class="card-body gap-4">
          <h2 class="card-title text-lg">
            <FontAwesomeIcon :icon="currentOp.icon" class="text-primary" />
            {{ currentOp.label }}
          </h2>

          <!-- clone -->
          <template v-if="selectedOp === 'clone'">
            <label class="form-control">
              <div class="label"><span class="label-text">儲存庫 URL</span></div>
              <input
                v-model="form.url"
                type="text"
                placeholder="https://github.com/user/repo.git"
                class="input input-bordered"
              />
            </label>
            <label class="form-control">
              <div class="label"><span class="label-text">目標資料夾（選填）</span></div>
              <input
                v-model="form.dir"
                type="text"
                placeholder="my-project"
                class="input input-bordered"
              />
            </label>
          </template>

          <!-- commit -->
          <template v-else-if="selectedOp === 'commit'">
            <label class="form-control">
              <div class="label"><span class="label-text">提交類型</span></div>
              <select v-model="form.commitType" class="select select-bordered">
                <option value="feat">feat - 新功能</option>
                <option value="fix">fix - 修復 bug</option>
                <option value="docs">docs - 文件更新</option>
                <option value="style">style - 程式碼格式</option>
                <option value="refactor">refactor - 重構</option>
                <option value="test">test - 測試</option>
                <option value="chore">chore - 雜項</option>
              </select>
            </label>
            <label class="form-control">
              <div class="label"><span class="label-text">範圍（選填）</span></div>
              <input
                v-model="form.scope"
                type="text"
                placeholder="auth, api, ui..."
                class="input input-bordered"
              />
            </label>
            <label class="form-control">
              <div class="label"><span class="label-text">提交訊息</span></div>
              <input
                v-model="form.message"
                type="text"
                placeholder="簡短描述這次變更"
                class="input input-bordered"
              />
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="form.includeAdd" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">自動加入 git add .</span>
            </label>
          </template>

          <!-- branch -->
          <template v-else-if="selectedOp === 'branch'">
            <div class="form-control">
              <div class="label"><span class="label-text">操作</span></div>
              <div class="flex gap-4 flex-wrap">
                <label
                  v-for="a in branchActions"
                  :key="a.value"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    v-model="form.branchAction"
                    :value="a.value"
                    class="radio radio-sm"
                  />
                  <span>{{ a.label }}</span>
                </label>
              </div>
            </div>
            <label class="form-control">
              <div class="label"><span class="label-text">分支名稱</span></div>
              <input
                v-model="form.branchName"
                type="text"
                placeholder="feature/my-feature"
                class="input input-bordered"
              />
            </label>
            <label
              v-if="form.branchAction === 'delete'"
              class="label cursor-pointer justify-start gap-3"
            >
              <input v-model="form.force" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">強制刪除 (-D)，即使尚未合併</span>
            </label>
          </template>

          <!-- merge -->
          <template v-else-if="selectedOp === 'merge'">
            <label class="form-control">
              <div class="label"><span class="label-text">要合併的分支</span></div>
              <input
                v-model="form.sourceBranch"
                type="text"
                placeholder="feature/my-feature"
                class="input input-bordered"
              />
            </label>
            <div class="form-control">
              <div class="label"><span class="label-text">合併策略</span></div>
              <div class="flex flex-col gap-2">
                <label
                  v-for="f in mergeFlags"
                  :key="f.value"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    v-model="form.mergeFlag"
                    :value="f.value"
                    class="radio radio-sm"
                  />
                  <span>{{ f.label }}</span>
                </label>
              </div>
            </div>
          </template>

          <!-- rebase -->
          <template v-else-if="selectedOp === 'rebase'">
            <label class="form-control">
              <div class="label"><span class="label-text">目標分支</span></div>
              <input
                v-model="form.targetBranch"
                type="text"
                placeholder="main"
                class="input input-bordered"
              />
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="form.interactive" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">互動模式 (-i)</span>
            </label>
          </template>

          <!-- push -->
          <template v-else-if="selectedOp === 'push'">
            <label class="form-control">
              <div class="label"><span class="label-text">遠端名稱</span></div>
              <input
                v-model="form.remote"
                type="text"
                placeholder="origin"
                class="input input-bordered"
              />
            </label>
            <label class="form-control">
              <div class="label"><span class="label-text">分支（選填）</span></div>
              <input
                v-model="form.branch"
                type="text"
                placeholder="main"
                class="input input-bordered"
              />
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="form.setUpstream" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">設定上游追蹤 (-u)</span>
            </label>
          </template>

          <!-- pull -->
          <template v-else-if="selectedOp === 'pull'">
            <label class="form-control">
              <div class="label"><span class="label-text">遠端名稱</span></div>
              <input
                v-model="form.remote"
                type="text"
                placeholder="origin"
                class="input input-bordered"
              />
            </label>
            <label class="form-control">
              <div class="label"><span class="label-text">分支（選填）</span></div>
              <input
                v-model="form.branch"
                type="text"
                placeholder="main"
                class="input input-bordered"
              />
            </label>
          </template>

          <!-- stash -->
          <template v-else-if="selectedOp === 'stash'">
            <div class="form-control">
              <div class="label"><span class="label-text">操作</span></div>
              <div class="flex gap-4 flex-wrap">
                <label
                  v-for="a in stashActions"
                  :key="a.value"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    v-model="form.stashAction"
                    :value="a.value"
                    class="radio radio-sm"
                  />
                  <span>{{ a.label }}</span>
                </label>
              </div>
            </div>
            <label v-if="form.stashAction === 'save'" class="form-control">
              <div class="label"><span class="label-text">備註訊息（選填）</span></div>
              <input
                v-model="form.stashMessage"
                type="text"
                placeholder="WIP: 進行中的工作"
                class="input input-bordered"
              />
            </label>
          </template>
        </div>
      </div>

      <!-- Preview -->
      <div class="card bg-base-200 shadow">
        <div class="card-body gap-4">
          <h2 class="card-title text-lg">
            <FontAwesomeIcon :icon="['fas', 'terminal']" class="text-primary" />
            產生的指令
          </h2>

          <div class="mockup-code min-h-[80px]">
            <template v-if="commandLines.length > 0">
              <pre v-for="(line, i) in commandLines" :key="i" data-prefix="$"
                ><code>{{ line }}</code></pre
              >
            </template>
            <pre v-else data-prefix="$"><code class="opacity-40">填寫左側表單後自動產生...</code></pre>
          </div>

          <div v-if="isWarning" class="alert alert-warning">
            <FontAwesomeIcon :icon="['fas', 'triangle-exclamation']" />
            <span class="text-sm">此操作會修改提交記錄，請確認目前為本機分支</span>
          </div>

          <button
            class="btn w-full"
            :class="copied ? 'btn-success' : 'btn-primary'"
            :disabled="commandLines.length === 0"
            @click="copyCommand"
          >
            <FontAwesomeIcon :icon="copied ? ['fas', 'check'] : ['fas', 'copy']" />
            {{ copied ? '已複製！' : '複製指令' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!selectedOp" class="text-center py-20 text-base-content/30">
      <FontAwesomeIcon :icon="['fas', 'hand-pointer']" class="text-6xl mb-4" />
      <p class="text-xl font-medium">選擇上方的操作類型開始使用</p>
    </div>
  </div>
</template>

<script setup>
const historyStore = useCommandHistoryStore()

const selectedOp = ref(null)
const copied = ref(false)

const form = ref({
  // clone
  url: '',
  dir: '',
  // commit
  commitType: 'feat',
  scope: '',
  message: '',
  includeAdd: true,
  // branch
  branchAction: 'create',
  branchName: '',
  force: false,
  // merge
  sourceBranch: '',
  mergeFlag: '',
  // rebase
  targetBranch: '',
  interactive: false,
  // push / pull
  remote: 'origin',
  branch: '',
  setUpstream: false,
  // stash
  stashAction: 'save',
  stashMessage: '',
})

const operations = [
  { id: 'clone', label: 'Clone', icon: ['fas', 'cloud-arrow-down'] },
  { id: 'commit', label: 'Commit', icon: ['fas', 'floppy-disk'] },
  { id: 'branch', label: 'Branch', icon: ['fas', 'code-branch'] },
  { id: 'merge', label: 'Merge', icon: ['fas', 'code-merge'] },
  { id: 'rebase', label: 'Rebase', icon: ['fas', 'arrows-rotate'] },
  { id: 'push', label: 'Push', icon: ['fas', 'upload'] },
  { id: 'pull', label: 'Pull', icon: ['fas', 'download'] },
  { id: 'stash', label: 'Stash', icon: ['fas', 'box-archive'] },
]

const branchActions = [
  { value: 'create', label: '建立' },
  { value: 'switch', label: '切換' },
  { value: 'delete', label: '刪除' },
]

const mergeFlags = [
  { value: '', label: '預設（允許 fast-forward）' },
  { value: '--no-ff', label: '--no-ff（保留合併節點）' },
  { value: '--squash', label: '--squash（壓縮為一個 commit）' },
]

const stashActions = [
  { value: 'save', label: 'save' },
  { value: 'pop', label: 'pop' },
  { value: 'list', label: 'list' },
  { value: 'drop', label: 'drop' },
]

const currentOp = computed(() => operations.find((o) => o.id === selectedOp.value))

const commandLines = computed(() => {
  const f = form.value
  switch (selectedOp.value) {
    case 'clone':
      if (!f.url) return []
      return [`git clone ${f.url}${f.dir ? ` ${f.dir}` : ''}`]

    case 'commit': {
      if (!f.message) return []
      const subject = f.scope
        ? `${f.commitType}(${f.scope}): ${f.message}`
        : `${f.commitType}: ${f.message}`
      const lines = []
      if (f.includeAdd) lines.push('git add .')
      lines.push(`git commit -m "${subject}"`)
      return lines
    }

    case 'branch':
      if (!f.branchName) return []
      if (f.branchAction === 'create') return [`git checkout -b ${f.branchName}`]
      if (f.branchAction === 'switch') return [`git checkout ${f.branchName}`]
      if (f.branchAction === 'delete') return [`git branch ${f.force ? '-D' : '-d'} ${f.branchName}`]
      return []

    case 'merge':
      if (!f.sourceBranch) return []
      return [`git merge${f.mergeFlag ? ` ${f.mergeFlag}` : ''} ${f.sourceBranch}`]

    case 'rebase':
      if (!f.targetBranch) return []
      return [`git rebase${f.interactive ? ' -i' : ''} ${f.targetBranch}`]

    case 'push': {
      const parts = ['git push']
      if (f.setUpstream) parts.push('-u')
      parts.push(f.remote || 'origin')
      if (f.branch) parts.push(f.branch)
      return [parts.join(' ')]
    }

    case 'pull': {
      const parts = ['git pull', f.remote || 'origin']
      if (f.branch) parts.push(f.branch)
      return [parts.join(' ')]
    }

    case 'stash':
      if (f.stashAction === 'save') {
        return [f.stashMessage ? `git stash save "${f.stashMessage}"` : 'git stash']
      }
      return [`git stash ${f.stashAction}`]

    default:
      return []
  }
})

const isWarning = computed(
  () =>
    selectedOp.value === 'rebase' ||
    (selectedOp.value === 'branch' && form.value.branchAction === 'delete' && form.value.force),
)

const selectOperation = (id) => {
  selectedOp.value = id
}

const copyCommand = async () => {
  const text = commandLines.value.join('\n')
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }

  copied.value = true
  historyStore.addCommand({
    operation: selectedOp.value,
    operationLabel: currentOp.value.label,
    command: text,
  })
  setTimeout(() => (copied.value = false), 2000)
}
</script>
