export const operations = [
  { id: 'clone', label: 'Clone', icon: ['fas', 'cloud-arrow-down'] },
  { id: 'commit', label: 'Commit', icon: ['fas', 'floppy-disk'] },
  { id: 'branch', label: 'Branch', icon: ['fas', 'code-branch'] },
  { id: 'merge', label: 'Merge', icon: ['fas', 'code-merge'] },
  { id: 'rebase', label: 'Rebase', icon: ['fas', 'arrows-rotate'] },
  { id: 'push', label: 'Push', icon: ['fas', 'upload'] },
  { id: 'pull', label: 'Pull', icon: ['fas', 'download'] },
  { id: 'stash', label: 'Stash', icon: ['fas', 'box-archive'] },
  { id: 'reset', label: 'Reset', icon: ['fas', 'arrow-rotate-left'] },
  { id: 'cherry-pick', label: 'Cherry Pick', icon: ['fas', 'code-commit'] },
  { id: 'tag', label: 'Tag', icon: ['fas', 'tag'] },
  { id: 'remote', label: 'Remote', icon: ['fas', 'server'] },
  { id: 'log', label: 'Log', icon: ['fas', 'list'] },
]

export const branchActions = [
  { value: 'create', label: '建立' },
  { value: 'switch', label: '切換' },
  { value: 'delete', label: '刪除' },
]

export const mergeFlags = [
  { value: '', label: '預設（允許 fast-forward）' },
  { value: '--no-ff', label: '--no-ff（保留合併節點）' },
  { value: '--squash', label: '--squash（壓縮為一個 commit）' },
]

export const stashActions = [
  { value: 'save', label: 'save' },
  { value: 'pop', label: 'pop' },
  { value: 'list', label: 'list' },
  { value: 'drop', label: 'drop' },
]

export const remoteActions = [
  { value: 'add', label: 'add（新增）' },
  { value: 'remove', label: 'remove（刪除）' },
  { value: 'rename', label: 'rename（重命名）' },
  { value: 'show', label: 'show（查看）' },
]

export const logFormats = [
  { value: 'default', label: '預設（完整格式）' },
  { value: 'oneline', label: '--oneline（單行簡潔）' },
  { value: 'graph', label: '--graph（圖形化分支）' },
  { value: 'stat', label: '--stat（含變更統計）' },
]

export const workflowSteps = {
  merge: (f) => {
    if (!f.sourceBranch) return []
    return [
      { cmd: 'git fetch origin', note: '從遠端同步最新資訊，確保 Git 掌握各分支的最新狀態' },
      { cmd: `git log --oneline origin/${f.sourceBranch} -5`, note: `確認來源分支（${f.sourceBranch}）的最新提交，確保這是你要合併進來的內容` },
    ]
  },

  rebase: (f) => {
    if (!f.targetBranch) return []
    return [
      { cmd: 'git fetch origin', note: '從遠端同步最新資訊，確保 Git 掌握各分支的最新狀態' },
      { cmd: `git log --oneline origin/${f.targetBranch} -5`, note: `確認目標分支（${f.targetBranch}）的最新提交，這是你的提交將會接在上面的基準點` },
    ]
  },

  'cherry-pick': () => [
    { cmd: 'git log --oneline', note: '列出提交歷史，找到要挑選的 commit hash' },
  ],

  push: (f) => {
    const remote = f.remote || 'origin'
    const steps = [
      { cmd: `git fetch ${remote}`, note: '同步遠端最新狀態，確認遠端是否有你沒有的新提交' },
    ]
    if (f.branch) {
      steps.push({
        cmd: `git log --oneline ${remote}/${f.branch}..HEAD`,
        note: `確認即將推送到 ${remote}/${f.branch} 的 commit 清單，避免推錯內容`,
      })
    } else {
      steps.push({
        cmd: 'git status',
        note: '確認目前分支與遠端的差距（ahead N commits），以及有無未提交的變更',
      })
    }
    return steps
  },

  reset: (f) => {
    const steps = [
      { cmd: 'git log --oneline -8', note: '確認提交歷史，找到你要回退到的目標位置' },
    ]
    if (f.resetMode === 'hard') {
      steps.push({
        cmd: 'git status',
        note: '確認目前有哪些未提交的變更，--hard 會永久清除這些內容，無法復原',
      })
    }
    return steps
  },

  branch: (f) => {
    if (!f.branchName) return []
    if (f.branchAction === 'create')
      return [
        { cmd: 'git status', note: '確認工作目錄乾淨，避免切換分支時帶入未提交的變更' },
        { cmd: 'git branch', note: '查看現有本地分支，確認新分支名稱不重複' },
      ]
    if (f.branchAction === 'switch')
      return [
        { cmd: 'git status', note: '確認工作目錄乾淨，切換分支前若有未提交變更可能導致衝突' },
      ]
    if (f.branchAction === 'delete')
      return [
        { cmd: 'git branch --merged', note: '列出已合併到目前分支的分支，確認要刪除的分支是否已合併' },
        { cmd: `git log --oneline ${f.branchName} -5`, note: `確認 ${f.branchName} 的最新幾筆提交，確保沒有遺漏重要工作` },
      ]
    return []
  },

  commit: (f) => {
    const steps = [{ cmd: 'git status', note: '確認工作目錄狀態，查看哪些檔案已變更或已暫存' }]
    if (f.includeAdd) {
      steps.push({ cmd: 'git diff', note: '檢視工作目錄的所有變更，確認即將 add 進去的內容' })
    } else {
      steps.push({ cmd: 'git diff --staged', note: '檢視暫存區的變更，確認即將提交的內容' })
    }
    return steps
  },

  pull: (f) => {
    const remote = f.remote || 'origin'
    const steps = [
      { cmd: 'git status', note: '確認工作目錄乾淨，有未提交的變更可能導致 pull 衝突' },
      { cmd: `git fetch ${remote}`, note: '先同步遠端資訊，讓你可以預覽即將拉取的內容' },
    ]
    if (f.branch) {
      steps.push({
        cmd: `git log --oneline HEAD..${remote}/${f.branch}`,
        note: `確認即將從 ${remote}/${f.branch} 拉取進來的 commit 清單`,
      })
    } else {
      steps.push({
        cmd: 'git log --oneline HEAD..@{u}',
        note: '確認追蹤分支上有哪些你還沒有的新提交',
      })
    }
    return steps
  },

  stash: (f) => {
    if (f.stashAction === 'save')
      return [
        { cmd: 'git status', note: '確認哪些檔案將被 stash，未追蹤的新檔案預設不包含' },
        { cmd: 'git diff', note: '預覽即將被 stash 的變更內容' },
      ]
    if (f.stashAction === 'pop' || f.stashAction === 'drop')
      return [
        { cmd: 'git stash list', note: '查看所有 stash，確認要取出的是哪一筆（預設為最新的 stash@{0}）' },
      ]
    return []
  },

  tag: (f) => {
    if (!f.tagName) return []
    return [
      { cmd: 'git log --oneline -10', note: '確認目前提交歷史，確保要打標籤的是正確的 commit' },
      { cmd: 'git fetch --tags', note: '同步遠端標籤，確認標籤名稱不與遠端重複' },
    ]
  },

  remote: (f) => {
    if (!f.remoteAction || f.remoteAction === 'show') return []
    return [{ cmd: 'git remote -v', note: '查看目前所有遠端連結與對應 URL，確認後再進行操作' }]
  },
}

export const explanations = {
  clone: (f) => {
    const lines = ['將遠端儲存庫完整複製到本地端，包含所有歷史紀錄']
    if (f.url) lines.push(`來源：${f.url}`)
    if (f.dir) lines.push(`目標目錄：${f.dir}`)
    else lines.push('目標目錄：使用遠端儲存庫的預設名稱')
    return lines
  },

  commit: (f) => {
    const subject = f.message
      ? f.scope
        ? `${f.commitType}(${f.scope}): ${f.message}`
        : `${f.commitType}: ${f.message}`
      : null
    const lines = [
      subject ? `建立一筆新的提交，訊息為「${subject}」` : '將暫存區的變更建立成一筆提交紀錄',
    ]
    if (f.includeAdd) lines.push('git add . 會將所有已變更的檔案加入暫存區')
    lines.push(`提交類型 ${f.commitType} 遵循 Conventional Commits 規範`)
    return lines
  },

  branch: (f) => {
    if (f.branchAction === 'create')
      return [
        f.branchName ? `建立新分支 ${f.branchName} 並立即切換過去` : '建立新分支並立即切換過去',
        'git checkout -b 是 git branch + git switch 的快捷合併',
      ]
    if (f.branchAction === 'switch')
      return [f.branchName ? `切換到已存在的分支 ${f.branchName}` : '切換到已存在的分支']
    if (f.branchAction === 'delete') {
      const lines = [f.branchName ? `刪除本地分支 ${f.branchName}` : '刪除本地分支']
      if (f.force) lines.push('-D 強制刪除，即使此分支尚未合併至其他分支也會執行')
      else lines.push('-d 安全刪除，若分支未合併 Git 會拒絕並提示警告')
      return lines
    }
    return ['管理本地分支：建立、切換或刪除']
  },

  merge: (f) => {
    const lines = [
      f.sourceBranch
        ? `將分支 ${f.sourceBranch} 合併到目前所在分支`
        : '將指定分支合併到目前所在分支',
    ]
    if (f.mergeFlag === '--no-ff')
      lines.push('--no-ff 強制產生合併節點（merge commit），保留分支歷史')
    else if (f.mergeFlag === '--squash')
      lines.push('--squash 將來源分支的所有提交壓縮成一個，合併後需手動 commit')
    else lines.push('預設允許 fast-forward，若可直線推進則不產生額外 commit')
    return lines
  },

  rebase: (f) => {
    const lines = [
      f.targetBranch
        ? `將目前分支的提交重新接到 ${f.targetBranch} 的最新點上`
        : '將目前分支的提交重新接到目標分支的最新點上',
      'rebase 會重寫提交歷史，讓提交紀錄保持線性',
    ]
    if (f.interactive) lines.push('-i 互動模式可讓你逐一編輯、合併或刪除每個提交')
    return lines
  },

  push: (f) => {
    const remote = f.remote || 'origin'
    const lines = [`將本地提交推送到遠端 ${remote}`]
    if (f.branch) lines.push(`指定推送分支：${f.branch}`)
    if (f.setUpstream) lines.push('-u 設定上游追蹤，之後可直接 git push 不需帶參數')
    if (f.forcePush && f.forceWithLease)
      lines.push('--force-with-lease 僅在遠端沒有新提交時才強制推送，比 --force 安全')
    else if (f.forcePush) lines.push('--force 強制覆蓋遠端歷史，可能導致協作者的工作遺失')
    return lines
  },

  pull: (f) => {
    const remote = f.remote || 'origin'
    const lines = [`從遠端 ${remote} 拉取最新提交並合併到目前分支`]
    if (f.branch) lines.push(`指定拉取分支：${f.branch}`)
    else lines.push('未指定分支時使用目前追蹤的遠端分支')
    lines.push('git pull 相當於 git fetch 加上 git merge')
    return lines
  },

  stash: (f) => {
    if (f.stashAction === 'save') {
      const lines = ['將目前工作目錄與暫存區的變更暫時儲存起來，讓工作目錄恢復乾淨']
      if (f.stashMessage) lines.push(`備註訊息：${f.stashMessage}`)
      lines.push('常用於需要臨時切換分支但不想提交目前進度的情況')
      return lines
    }
    if (f.stashAction === 'pop')
      return ['取出最近一筆 stash 並套用到工作目錄，套用成功後自動刪除該 stash']
    if (f.stashAction === 'list') return ['列出所有已儲存的 stash，每筆顯示索引、分支與備註']
    if (f.stashAction === 'drop') return ['刪除最近一筆 stash，若要指定刪除可加上 stash@{n}']
    return ['暫時儲存目前未完成的工作，稍後再取回繼續']
  },

  reset: (f) => {
    const target = f.resetTarget || 'HEAD~1'
    const lines = [`將 HEAD 移回到 ${target}`]
    if (f.resetMode === 'soft')
      lines.push('--soft 保留暫存區與工作目錄的變更，提交內容退回暫存狀態')
    else if (f.resetMode === 'mixed')
      lines.push('--mixed（預設）清除暫存區，但工作目錄的檔案內容不變')
    else if (f.resetMode === 'hard')
      lines.push('--hard 清除暫存區與工作目錄，所有未提交的變更將永久消失')
    return lines
  },

  'cherry-pick': (f) => {
    const lines = [
      f.cherryPickHash
        ? `將指定 commit（${f.cherryPickHash}）的變更套用到目前分支`
        : '從其他分支挑選特定的 commit 套用到目前分支',
      '只挑選該 commit 的差異內容，不影響其他歷史',
    ]
    if (f.cherryPickNoCommit)
      lines.push('-n 只套用變更到工作目錄，不自動建立 commit，方便調整後再提交')
    return lines
  },

  tag: (f) => {
    const lines = [
      f.tagName ? `在目前 commit 上建立標籤 ${f.tagName}` : '在目前 commit 上建立版本標籤',
    ]
    if (f.tagType === 'annotated') {
      lines.push('-a 附註標籤會記錄建立者、時間與說明，適合正式版本發布')
      if (f.tagMessage) lines.push(`標籤說明：${f.tagMessage}`)
    } else {
      lines.push('輕量標籤只是一個指向 commit 的指標，沒有額外元資料')
    }
    if (f.tagPush && f.tagName) lines.push(`git push origin ${f.tagName} 將此標籤推送到遠端`)
    return lines
  },

  remote: (f) => {
    const name = f.remoteName || 'origin'
    if (f.remoteAction === 'add') {
      const lines = [`新增遠端連結，命名為 ${name}`]
      if (f.remoteUrl) {
        lines.push(`遠端位址：${f.remoteUrl}`)
        lines.push(`之後可用 git push/pull ${name} 與此遠端互動`)
      }
      return lines
    }
    if (f.remoteAction === 'remove')
      return [`移除本地端對遠端 ${name} 的連結設定（不影響遠端本身）`]
    if (f.remoteAction === 'rename') {
      const lines = [`將遠端 ${name} 重新命名`]
      if (f.remoteNewName) lines.push(`新名稱：${f.remoteNewName}`)
      return lines
    }
    if (f.remoteAction === 'show') return [`顯示遠端 ${name} 的詳細資訊，包含 URL 與追蹤分支`]
    return ['管理遠端連結：新增、刪除、重命名或查看']
  },

  log: (f) => {
    const lines = ['顯示目前分支的提交歷史']
    if (f.logFormat === 'oneline')
      lines.push('--oneline 每筆 commit 只顯示 hash 與標題，方便快速瀏覽')
    else if (f.logFormat === 'graph') lines.push('--graph 以 ASCII 圖形視覺化顯示分支合併結構')
    else if (f.logFormat === 'stat') lines.push('--stat 在每筆 commit 下方顯示變更的檔案與行數統計')
    if (f.logAuthor) lines.push(`只顯示作者包含「${f.logAuthor}」的提交`)
    if (f.logCount) lines.push(`限制顯示最近 ${f.logCount} 筆`)
    return lines
  },
}
