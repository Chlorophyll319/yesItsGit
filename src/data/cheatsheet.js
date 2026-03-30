export const categories = [
  {
    id: 'basics',
    name: '基礎操作',
    icon: ['fas', 'seedling'],
    commands: [
      {
        command: 'git init',
        desc: '在當前目錄初始化一個新的 Git 儲存庫',
        example: 'git init',
      },
      {
        command: 'git clone <url>',
        desc: '克隆遠端儲存庫到本地',
        example: 'git clone https://github.com/user/repo.git',
      },
      {
        command: 'git status',
        desc: '查看工作目錄與暫存區的狀態',
        example: 'git status',
      },
      {
        command: 'git diff',
        desc: '比較工作目錄與暫存區的差異',
        example: 'git diff',
      },
      {
        command: 'git diff --staged',
        desc: '比較暫存區與最新提交的差異',
        example: 'git diff --staged',
      },
      {
        command: 'git log',
        desc: '查看提交歷史記錄',
        example: 'git log',
      },
      {
        command: 'git log --oneline',
        desc: '以單行簡潔格式顯示提交記錄',
        example: 'git log --oneline',
      },
      {
        command: 'git log --graph',
        desc: '以圖形化方式顯示分支結構',
        example: 'git log --graph --oneline --all',
      },
    ],
  },
  {
    id: 'staging',
    name: '暫存與提交',
    icon: ['fas', 'floppy-disk'],
    commands: [
      {
        command: 'git add .',
        desc: '將所有變更加入暫存區',
        example: 'git add .',
      },
      {
        command: 'git add <file>',
        desc: '將指定檔案加入暫存區',
        example: 'git add src/main.js',
      },
      {
        command: 'git add -p',
        desc: '互動式選擇要暫存的區塊',
        example: 'git add -p',
      },
      {
        command: 'git commit -m "<msg>"',
        desc: '提交暫存區的內容並附上訊息',
        example: 'git commit -m "feat: add login page"',
      },
      {
        command: 'git commit --amend',
        desc: '修改最後一次提交的訊息或內容',
        example: 'git commit --amend -m "fix: correct typo in login"',
      },
      {
        command: 'git reset HEAD <file>',
        desc: '將檔案從暫存區移出（不影響工作目錄）',
        example: 'git reset HEAD src/main.js',
      },
      {
        command: 'git restore <file>',
        desc: '捨棄工作目錄中的變更',
        example: 'git restore src/main.js',
      },
      {
        command: 'git restore --staged <file>',
        desc: '將暫存區的檔案移回工作目錄',
        example: 'git restore --staged src/main.js',
      },
    ],
  },
  {
    id: 'branch',
    name: '分支管理',
    icon: ['fas', 'code-branch'],
    commands: [
      {
        command: 'git branch',
        desc: '列出所有本地分支',
        example: 'git branch',
      },
      {
        command: 'git branch -a',
        desc: '列出所有本地與遠端分支',
        example: 'git branch -a',
      },
      {
        command: 'git branch <name>',
        desc: '建立新分支（不切換）',
        example: 'git branch feature/login',
      },
      {
        command: 'git checkout -b <name>',
        desc: '建立並切換到新分支',
        example: 'git checkout -b feature/login',
      },
      {
        command: 'git switch <name>',
        desc: '切換到指定分支',
        example: 'git switch main',
      },
      {
        command: 'git branch -d <name>',
        desc: '刪除已合併的分支',
        example: 'git branch -d feature/login',
      },
      {
        command: 'git branch -D <name>',
        desc: '強制刪除分支（即使未合併）',
        example: 'git branch -D feature/wip',
      },
      {
        command: 'git merge <branch>',
        desc: '將指定分支合併到當前分支',
        example: 'git merge feature/login',
      },
      {
        command: 'git merge --no-ff <branch>',
        desc: '合併並保留合併節點（不快轉）',
        example: 'git merge --no-ff feature/login',
      },
      {
        command: 'git rebase <branch>',
        desc: '將當前分支的提交移到指定分支之後',
        example: 'git rebase main',
      },
    ],
  },
  {
    id: 'remote',
    name: '遠端操作',
    icon: ['fas', 'cloud'],
    commands: [
      {
        command: 'git remote -v',
        desc: '查看所有遠端儲存庫設定',
        example: 'git remote -v',
      },
      {
        command: 'git remote add origin <url>',
        desc: '新增名為 origin 的遠端儲存庫',
        example: 'git remote add origin https://github.com/user/repo.git',
      },
      {
        command: 'git fetch',
        desc: '抓取遠端所有更新（不合併）',
        example: 'git fetch',
      },
      {
        command: 'git fetch <remote>',
        desc: '抓取指定遠端的更新',
        example: 'git fetch origin',
      },
      {
        command: 'git pull',
        desc: '抓取遠端更新並合併到當前分支',
        example: 'git pull',
      },
      {
        command: 'git pull --rebase',
        desc: '抓取遠端更新並以 rebase 方式整合',
        example: 'git pull --rebase origin main',
      },
      {
        command: 'git push origin <branch>',
        desc: '推送本地分支到遠端',
        example: 'git push origin feature/login',
      },
      {
        command: 'git push -u origin <branch>',
        desc: '推送並設定上游追蹤分支',
        example: 'git push -u origin main',
      },
      {
        command: 'git push --force-with-lease',
        desc: '安全的強制推送（遠端有新提交則拒絕）',
        example: 'git push --force-with-lease origin feature/login',
      },
    ],
  },
  {
    id: 'advanced',
    name: '進階操作',
    icon: ['fas', 'wand-magic-sparkles'],
    commands: [
      {
        command: 'git stash',
        desc: '暫存當前所有未提交的變更',
        example: 'git stash',
      },
      {
        command: 'git stash pop',
        desc: '取出最近一次暫存並應用',
        example: 'git stash pop',
      },
      {
        command: 'git stash list',
        desc: '列出所有暫存記錄',
        example: 'git stash list',
      },
      {
        command: 'git stash drop',
        desc: '刪除最近一次暫存記錄',
        example: 'git stash drop',
      },
      {
        command: 'git reset --soft HEAD~1',
        desc: '撤銷最後一次提交，保留所有變更在暫存區',
        example: 'git reset --soft HEAD~1',
      },
      {
        command: 'git reset --mixed HEAD~1',
        desc: '撤銷最後一次提交，變更回到工作目錄',
        example: 'git reset --mixed HEAD~1',
      },
      {
        command: 'git reset --hard HEAD~1',
        desc: '撤銷最後一次提交並丟棄所有變更（危險）',
        example: 'git reset --hard HEAD~1',
      },
      {
        command: 'git revert <commit>',
        desc: '建立一個新提交來撤銷指定提交（保留歷史）',
        example: 'git revert a1b2c3d',
      },
      {
        command: 'git cherry-pick <commit>',
        desc: '將指定提交應用到當前分支',
        example: 'git cherry-pick a1b2c3d',
      },
      {
        command: 'git tag <name>',
        desc: '在當前提交建立輕量標籤',
        example: 'git tag v1.0.0',
      },
      {
        command: 'git tag -a <name> -m "<msg>"',
        desc: '建立附帶訊息的附註標籤',
        example: 'git tag -a v1.0.0 -m "Release version 1.0.0"',
      },
    ],
  },
]
