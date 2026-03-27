<route lang="yaml">
meta:
  title: '首頁'
  login: ''
  admin: false
</route>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl font-bold">Git 指令產生器</h1>
      <p class="mt-2 text-sm md:text-base text-base-content/60">選擇操作類型，填入參數，一鍵複製指令</p>
    </div>

    <!-- Operation Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <button
        v-for="op in operations"
        :key="op.id"
        class="card cursor-pointer transition-all duration-200 py-4 px-2 flex flex-col items-center gap-2 hover:shadow-md min-h-[72px]"
        :class="selectedOp === op.id ? 'bg-primary text-primary-content shadow-md' : 'bg-base-200 hover:bg-base-300'"
        @click="selectOperation(op.id)"
      >
        <FontAwesomeIcon :icon="op.icon" class="text-2xl" />
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
            <div class="divider my-0"></div>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="form.forcePush" type="checkbox" class="checkbox checkbox-sm checkbox-error" />
              <span class="label-text font-medium text-error">強制推送（危險）</span>
            </label>
            <label v-if="form.forcePush" class="label cursor-pointer justify-start gap-3">
              <input v-model="form.forceWithLease" type="checkbox" class="checkbox checkbox-sm" />
              <span class="label-text">改用 --force-with-lease（較安全）</span>
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

          <!-- reset -->
          <template v-else-if="selectedOp === 'reset'">
            <div class="form-control">
              <div class="label"><span class="label-text">重置模式</span></div>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.resetMode" value="soft" class="radio radio-sm" />
                  <span>--soft（保留暫存區與工作目錄）</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.resetMode" value="mixed" class="radio radio-sm" />
                  <span>--mixed（清除暫存區，保留工作目錄）</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.resetMode" value="hard" class="radio radio-sm radio-error" />
                  <span class="font-medium text-error">--hard（清除暫存區與工作目錄，危險）</span>
                </label>
              </div>
            </div>
            <label class="form-control">
              <div class="label"><span class="label-text">目標 commit</span></div>
              <input
                v-model="form.resetTarget"
                type="text"
                placeholder="HEAD~1"
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

          <div
            v-if="warningInfo"
            class="alert"
            :class="warningInfo.danger ? 'alert-error' : 'alert-warning'"
          >
            <FontAwesomeIcon :icon="['fas', 'triangle-exclamation']" class="text-xl shrink-0" />
            <div class="flex flex-col gap-0.5">
              <span class="font-bold text-sm">{{ warningInfo.title }}</span>
              <span class="text-sm opacity-80">{{ warningInfo.desc }}</span>
            </div>
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
    <div v-if="!selectedOp" class="text-center py-8 text-base-content/30">
      <FontAwesomeIcon :icon="['fas', 'hand-pointer']" class="text-4xl mb-3" />
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
  forcePush: false,
  forceWithLease: false,
  // stash
  stashAction: 'save',
  stashMessage: '',
  // reset
  resetMode: 'mixed',
  resetTarget: 'HEAD~1',
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
  { id: 'reset', label: 'Reset', icon: ['fas', 'arrow-rotate-left'] },
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
      if (f.forcePush) parts.push(f.forceWithLease ? '--force-with-lease' : '--force')
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

    case 'reset':
      if (!f.resetTarget) return []
      return [`git reset --${f.resetMode} ${f.resetTarget}`]

    default:
      return []
  }
})

const warningInfo = computed(() => {
  const f = form.value
  if (selectedOp.value === 'push' && f.forcePush) {
    if (f.forceWithLease) {
      return {
        danger: false,
        title: '注意：--force-with-lease',
        desc: '遠端若有新提交則會拒絕推送，比 --force 安全，但仍會覆蓋遠端歷史',
      }
    }
    return {
      danger: true,
      title: '高危險：強制覆蓋遠端歷史，無法復原',
      desc: '其他協作者基於舊歷史的提交可能永久遺失，確認所有人已知情再執行',
    }
  }
  if (selectedOp.value === 'rebase') {
    return {
      danger: false,
      title: '注意：rebase 會重寫提交歷史',
      desc: '若此分支已推送至遠端，需搭配 git push --force-with-lease 才能更新，請謹慎使用',
    }
  }
  if (selectedOp.value === 'branch' && f.branchAction === 'delete' && f.force) {
    return {
      danger: false,
      title: '注意：強制刪除分支 (-D)',
      desc: '即使分支尚未合併至其他分支，所有未合併的提交也會隨之丟失',
    }
  }
  if (selectedOp.value === 'reset' && f.resetMode === 'hard') {
    return {
      danger: true,
      title: '高危險：--hard 會永久丟棄所有未提交的變更，無法復原',
      desc: '工作目錄與暫存區的修改將全部消失，git 無法協助還原，請先確認沒有重要未提交內容',
    }
  }
  return null
})

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
