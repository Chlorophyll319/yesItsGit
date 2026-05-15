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
