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

export const explanations = {
  clone: (f) => {
    const lines = ['git clone 會將遠端倉庫複製到本機，包含完整的歷史記錄與分支資訊。']
    if (f.dir) lines.push(`複製後會建立 "${f.dir}" 目錄。`)
    return lines
  },
  commit: (f) => {
    const lines = []
    if (f.includeAdd) lines.push('git add . 會將工作目錄中所有變更加入暫存區（Staging Area）。')
    lines.push('git commit -m 將暫存區的變更儲存為一個新的提交記錄。')
    if (f.commitType) lines.push(`提交類型 "${f.commitType}" 遵循 Conventional Commits 規範，方便自動化工具解析。`)
    return lines
  },
  branch: (f) => {
    if (f.branchAction === 'create') return ['git checkout -b 會建立新分支並立刻切換過去，等同於 git branch + git checkout。']
    if (f.branchAction === 'switch') return ['git checkout 切換到指定分支，工作目錄內容會更新為該分支的最新狀態。']
    if (f.branchAction === 'delete') {
      if (f.force) return ['git branch -D 強制刪除分支，即使該分支尚未合併也會刪除。']
      return ['git branch -d 刪除已合併的分支，若分支尚未合併則會拒絕刪除。']
    }
    return []
  },
  merge: (f) => {
    const lines = ['git merge 將指定分支的變更合併到當前分支。']
    if (f.mergeFlag === '--no-ff') lines.push('--no-ff 強制建立合併提交，保留分支歷史，便於追蹤。')
    if (f.mergeFlag === '--squash') lines.push('--squash 將所有提交壓縮成一個變更集，需再手動 commit。')
    return lines
  },
  rebase: (f) => {
    const lines = ['git rebase 將當前分支的提交「移植」到目標分支的最新點之後，使歷史記錄保持線性。']
    if (f.interactive) lines.push('-i（互動模式）允許重新排序、合併、修改或刪除提交。')
    return lines
  },
  push: (f) => {
    const lines = ['git push 將本機的提交上傳到遠端倉庫。']
    if (f.setUpstream) lines.push('-u 設定追蹤關係，之後可直接執行 git push / git pull 不需指定遠端與分支。')
    if (f.forcePush) lines.push('--force 強制推送，會覆蓋遠端歷史，請謹慎使用。')
    if (f.forceWithLease) lines.push('--force-with-lease 比 --force 更安全，若遠端有他人推送則會中止。')
    return lines
  },
  pull: (f) => {
    return ['git pull 等同於 git fetch + git merge，會拉取遠端變更並合併到本機分支。']
  },
  stash: (f) => {
    if (f.stashAction === 'save') return ['git stash 暫時儲存尚未提交的變更，讓工作目錄恢復乾淨狀態。']
    if (f.stashAction === 'pop') return ['git stash pop 取回最新一筆暫存的變更，並從 stash 列表中移除。']
    if (f.stashAction === 'list') return ['git stash list 列出所有暫存的變更記錄。']
    if (f.stashAction === 'drop') return ['git stash drop 刪除指定的暫存記錄，預設刪除最新一筆。']
    return []
  },
  reset: (f) => {
    const lines = []
    if (f.resetMode === 'soft') lines.push('--soft 只移動 HEAD 指針，暫存區與工作目錄的變更保留。')
    else if (f.resetMode === 'mixed') lines.push('--mixed（預設）移動 HEAD 並清空暫存區，但工作目錄的變更保留。')
    else if (f.resetMode === 'hard') lines.push('--hard 移動 HEAD 並清空暫存區與工作目錄，所有未提交的變更都會消失。')
    lines.push(`git reset 將 HEAD 移動到 "${f.resetTarget || 'HEAD~1'}"。`)
    return lines
  },
  'cherry-pick': (f) => {
    const lines = ['git cherry-pick 將指定提交的變更套用到當前分支，不需要合併整個分支。']
    if (f.cherryPickNoCommit) lines.push('--no-commit 只套用變更到暫存區，不自動建立提交，讓你有機會調整。')
    return lines
  },
  tag: (f) => {
    if (f.tagType === 'lightweight') return ['輕量標籤（Lightweight Tag）只是一個指向特定提交的指標，不含額外資訊。']
    if (f.tagType === 'annotated') {
      const lines = ['附註標籤（Annotated Tag）包含作者、日期、訊息等完整資訊，適合用於正式版本發布。']
      if (f.tagPush) lines.push('git push --tags 會將本機所有標籤推送到遠端倉庫。')
      return lines
    }
    return []
  },
  remote: (f) => {
    if (f.remoteAction === 'add') return ['git remote add 新增一個遠端倉庫的對應別名，讓本機能與遠端通訊。']
    if (f.remoteAction === 'remove') return ['git remote remove 移除本機對應的遠端倉庫設定，不影響遠端本身。']
    if (f.remoteAction === 'rename') return ['git remote rename 重新命名遠端倉庫的別名。']
    if (f.remoteAction === 'show') return ['git remote show 顯示遠端倉庫的詳細資訊，包含追蹤分支狀態。']
    return []
  },
  log: (f) => {
    const lines = ['git log 顯示提交歷史記錄。']
    if (f.logFormat === 'oneline') lines.push('--oneline 每個提交只顯示一行，包含縮短的 hash 與提交訊息。')
    if (f.logFormat === 'graph') lines.push('--graph 以 ASCII 圖形顯示分支與合併結構。')
    if (f.logFormat === 'stat') lines.push('--stat 顯示每個提交變更的檔案數量與行數統計。')
    if (f.logCount) lines.push(`-n ${f.logCount} 只顯示最近 ${f.logCount} 筆提交。`)
    if (f.logAuthor) lines.push(`--author 篩選指定作者的提交記錄。`)
    return lines
  },
}
