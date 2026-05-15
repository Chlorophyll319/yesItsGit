<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl font-bold">情境導向</h1>
      <p class="mt-2 text-sm md:text-base text-base-content/60">選擇你現在遇到的情況，查看建議的指令步驟</p>
    </div>

    <!-- Scenario cards -->
    <div class="space-y-3">
      <div
        v-for="scenario in scenarios"
        :key="scenario.id"
        class="card bg-base-200 shadow-sm"
      >
        <div
          class="card-body p-4 gap-0 cursor-pointer select-none"
          @click="toggleScenario(scenario.id)"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="text-2xl">{{ scenario.emoji }}</div>
              <div>
                <h2 class="font-bold text-base">{{ scenario.title }}</h2>
                <p class="text-sm text-base-content/50 mt-0.5">{{ scenario.subtitle }}</p>
              </div>
            </div>
            <FontAwesomeIcon
              :icon="['fas', expanded === scenario.id ? 'chevron-up' : 'chevron-down']"
              class="text-base-content/40 shrink-0"
            />
          </div>

          <!-- Expanded content -->
          <div v-if="expanded === scenario.id" class="mt-4 space-y-4" @click.stop>
            <p class="text-sm text-base-content/70">{{ scenario.desc }}</p>

            <div class="mockup-code text-sm">
              <pre
                v-for="(cmd, i) in scenario.commands"
                :key="i"
                :data-prefix="cmd.prefix ?? '$'"
              ><code>{{ cmd.text }}</code></pre>
            </div>

            <div v-if="scenario.note" class="alert alert-info py-2">
              <FontAwesomeIcon :icon="['fas', 'circle-info']" class="shrink-0" />
              <span class="text-sm">{{ scenario.note }}</span>
            </div>

            <div v-if="scenario.op" class="flex justify-end">
              <RouterLink
                :to="{ path: '/', query: { op: scenario.op } }"
                class="btn btn-primary btn-sm gap-2"
              >
                <FontAwesomeIcon :icon="['fas', 'wand-magic-sparkles']" />
                前往產生器
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const expanded = ref(null)

const toggleScenario = (id) => {
  expanded.value = expanded.value === id ? null : id
}

const scenarios = [
  {
    id: 'new-feature',
    emoji: '🌱',
    title: '我想開始一個新功能',
    subtitle: '建立新分支並開始開發',
    desc: '每個新功能都應該在獨立的分支上開發，完成後再合併回主線，保持主線穩定。',
    commands: [
      { text: 'git checkout -b feature/my-feature' },
      { text: '# 開始開發...', prefix: '#' },
      { text: 'git add .' },
      { text: 'git commit -m "feat: 新功能描述"' },
    ],
    op: 'branch',
  },
  {
    id: 'pull-latest',
    emoji: '⬇️',
    title: '我想把遠端最新代碼拉下來',
    subtitle: '同步遠端更新',
    desc: '建議先 fetch 確認有哪些更新，再決定是否 pull 合併。',
    commands: [
      { text: 'git fetch origin' },
      { text: 'git pull origin main' },
    ],
    op: 'pull',
  },
  {
    id: 'undo',
    emoji: '😱',
    title: '我搞砸了，想回到上一版',
    subtitle: '撤銷提交或恢復變更',
    desc: '根據你的情況選擇方式：若尚未推送可用 reset，若已推送建議用 revert（保留歷史）。',
    commands: [
      { text: '# 尚未推送：撤銷最後一次 commit（保留變更）', prefix: '#' },
      { text: 'git reset --soft HEAD~1' },
      { text: '# 已推送：建立新 commit 來撤銷（安全）', prefix: '#' },
      { text: 'git revert HEAD' },
    ],
    note: '絕對避免對已推送的分支使用 git reset --hard，會造成他人的歷史衝突。',
    op: 'reset',
  },
  {
    id: 'cherry-pick',
    emoji: '🍒',
    title: '我想把另一個分支的某個 commit 拿過來',
    subtitle: '選取特定提交應用到當前分支',
    desc: '先用 git log 找到目標 commit 的 hash，再用 cherry-pick 套用。',
    commands: [
      { text: 'git log other-branch --oneline' },
      { text: 'git cherry-pick <commit-hash>' },
    ],
    op: 'cherry-pick',
  },
  {
    id: 'clean-commits',
    emoji: '🧹',
    title: '我要交 PR，先整理 commit',
    subtitle: '用 rebase -i 合併或修改提交',
    desc: '互動式 rebase 讓你可以合併（squash）、重排、修改提交訊息，讓 PR 歷史更乾淨。',
    commands: [
      { text: 'git rebase -i HEAD~3' },
      { text: '# 在編輯器中將 pick 改成 squash（s）', prefix: '#' },
      { text: 'git push --force-with-lease origin feature/my-feature' },
    ],
    note: 'rebase 後需要用 --force-with-lease 推送，請確認沒有其他人在同一分支上工作。',
    op: 'rebase',
  },
  {
    id: 'release',
    emoji: '🏷️',
    title: '我要發佈一個版本',
    subtitle: '建立版本標籤並推送',
    desc: '使用附註標籤（annotated tag）記錄版本資訊，再推送至遠端讓 CI/CD 觸發發布流程。',
    commands: [
      { text: 'git tag -a v1.0.0 -m "Release version 1.0.0"' },
      { text: 'git push origin v1.0.0' },
    ],
    op: 'tag',
  },
  {
    id: 'stash',
    emoji: '📦',
    title: '我的改動想先存起來',
    subtitle: '暫存目前的工作進度',
    desc: '需要緊急切換分支處理其他事情，但目前改動還沒準備好 commit 時使用。',
    commands: [
      { text: 'git stash save "WIP: 進行中的工作"' },
      { text: '# 處理其他事情...', prefix: '#' },
      { text: 'git stash pop' },
    ],
    op: 'stash',
  },
  {
    id: 'blame',
    emoji: '🔍',
    title: '我想查看是誰改了這行',
    subtitle: '追蹤程式碼變更來源',
    desc: 'git blame 可以查看每一行最後由誰在哪個 commit 修改，適合追查問題來源。',
    commands: [
      { text: 'git blame src/app.js' },
      { text: 'git log --follow -p src/app.js' },
    ],
    note: '速查表中有更多 git log 相關指令可以查閱。',
    op: 'log',
  },
  {
    id: 'share',
    emoji: '🤝',
    title: '我要和同事共用代碼',
    subtitle: '設定遠端並推送',
    desc: '將本地儲存庫連結到遠端，設定上游追蹤後方便日後 push/pull。',
    commands: [
      { text: 'git remote add origin https://github.com/user/repo.git' },
      { text: 'git push -u origin main' },
    ],
    op: 'remote',
  },
  {
    id: 'init',
    emoji: '🚀',
    title: '我第一次用 Git 初始化專案',
    subtitle: '從零開始建立 Git 儲存庫',
    desc: '在本地建立 Git 儲存庫、建立第一個 commit，再連結到遠端（如 GitHub）。',
    commands: [
      { text: 'git init' },
      { text: 'git add .' },
      { text: 'git commit -m "chore: initial commit"' },
      { text: 'git remote add origin https://github.com/user/repo.git' },
      { text: 'git push -u origin main' },
    ],
    op: 'commit',
  },
]
</script>
