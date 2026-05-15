import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// FontAwesome - 按需載入，避免整包 import 增大 bundle
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBars,
  faSun,
  faMoon,
  faBook,
  faEnvelope,
  faTerminal,
  faTriangleExclamation,
  faCheck,
  faCopy,
  faHandPointer,
  faCloudArrowDown,
  faFloppyDisk,
  faCodeBranch,
  faCodeMerge,
  faArrowsRotate,
  faUpload,
  faDownload,
  faBoxArchive,
  faArrowRotateLeft,
  // Batch 2+
  faCodeCommit,
  faTag,
  faServer,
  faList,
  // Batch 3+
  faCircleQuestion,
  faCircleInfo,
  // Batch 4+
  faMagnifyingGlass,
  faXmark,
  faFaceFrown,
  faSeedling,
  faCloud,
  faWandMagicSparkles,
  faChevronUp,
  faChevronDown,
  // Batch 5+
  faClockRotateLeft,
  faTrash,
  faHouse,
  // Batch 6+
  faStar,
  faCubes,
  faMap,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import './style.css'

// 設定 FontAwesome
library.add(
  faBars,
  faSun,
  faMoon,
  faBook,
  faEnvelope,
  faTerminal,
  faTriangleExclamation,
  faCheck,
  faCopy,
  faHandPointer,
  faCloudArrowDown,
  faFloppyDisk,
  faCodeBranch,
  faCodeMerge,
  faArrowsRotate,
  faUpload,
  faDownload,
  faBoxArchive,
  faArrowRotateLeft,
  faCodeCommit,
  faTag,
  faServer,
  faList,
  faCircleQuestion,
  faCircleInfo,
  faMagnifyingGlass,
  faXmark,
  faFaceFrown,
  faSeedling,
  faCloud,
  faWandMagicSparkles,
  faChevronUp,
  faChevronDown,
  faClockRotateLeft,
  faTrash,
  faHouse,
  faStar,
  faCubes,
  faMap,
  faGithub,
)

// 建立 Pinia 實例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 建立應用實例
const app = createApp(App)

// 註冊插件
app.use(pinia)
app.use(router)

// 註冊 FontAwesome 元件
app.component('FontAwesomeIcon', FontAwesomeIcon)

// 掛載應用
app.mount('#app')
