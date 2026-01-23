<!-- TeleCheck.vue 
 输入场景的id, 遍历tele.ts getTeles(), 取ScenePrototype=id 的tgtScene,
 从 tgtScene 找到scene.ts xls = getScene(tgtScene) 
 1. 不存在 
 2. 室内 xls.Belong = id
 2. area xls.SceneArea = id 
 -->

<template>
  <div class="tele-check">
    <div class="input-section">
      <input v-model.number="sceneId" type="number" placeholder="输入场景ID" />
      <button @click="checkTeleports">检查传送点</button>
    </div>

    <div v-if="results.length > 0" class="results">
      <div class="summary">
        共 {{ results.length }} 个传送点，
        <span class="error">{{ errorCount }} 错误</span>，
        <span class="warning">{{ warningCount }} 警告</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tele ID</th>
            <th>目标场景</th>
            <th>状态</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in results" :key="r.teleId" :class="r.status">
            <td>{{ r.teleId }}</td>
            <td>{{ r.tgtScene }}</td>
            <td>{{ r.statusText }}</td>
            <td>{{ r.message }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="checked" class="no-results">
      该场景下没有传送点
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getTeles, XlsTeleport } from "../../../data/tele";
import { getScene, XlsScene, isIndoor } from "../../../data/scene";

const sceneId = ref<number>(0);
const results = ref<CheckResult[]>([]);
const checked = ref(false);

interface CheckResult {
  teleId: number;
  tgtScene: string|number;
  status: "error" | "warning" | "success";
  statusText: string;
  message: string;
}

const errorCount = computed(() => results.value.filter(r => r.status === "error").length);
const warningCount = computed(() => results.value.filter(r => r.status === "warning").length);

async function checkTeleports() {
  if (!sceneId.value) return;

  results.value = [];
  checked.value = false;

  const teles = await getTeles();
  const teleports = Object.values(teles).filter(t => t.ScenePrototype === sceneId.value);

  for (const tele of teleports) {
    const result = await checkTeleport(tele);
    results.value.push(result);
  }

  checked.value = true;
}

async function checkTeleport(tele: XlsTeleport): Promise<CheckResult> {
  const xls = await getScene(tele.tgtScene);

  if (!xls) {
    return {
      teleId: tele.Id,
      tgtScene: tele.tgtScene,
      status: "error",
      statusText: "不存在",
      message: `目标场景 ${tele.tgtScene} 不存在`
    };
  }
  const sname = xls.Name+`(${xls.Id})`;

  if (isIndoor(xls.Type)) {
    if (xls.Belong === sceneId.value) {
      return {
        teleId: tele.Id,
        tgtScene: sname,
        status: "success",
        statusText: "正确",
        message: `室内场景 Belong=${xls.Belong}`
      };
    } else {
      return {
        teleId: tele.Id,
        tgtScene: sname,
        status: "warning",
        statusText: "不匹配",
        message: `室内场景，Belong 应为 ${sceneId.value}，实际为 ${xls.Belong}`
      };
    }
  } else {
    if (xls.SceneArea === sceneId.value) {
      return {
        teleId: tele.Id,
        tgtScene: sname,
        status: "success",
        statusText: "正确",
        message: `场景区域 SceneArea=${xls.SceneArea}`
      };
    } else if (xls.SceneArea) {
      return {
        teleId: tele.Id,
        tgtScene: sname,
        status: "success",
        statusText: "相邻",
        message: `场景区域 SceneArea=${xls.SceneArea}`
      };
    } else {
      return {
        teleId: tele.Id,
        tgtScene: sname,
        status: "warning",
        statusText: "不匹配",
        message: `no xls.SceneArea`
      };
    }
  }
}
</script>

<style scoped>
.tele-check {
  padding: 16px;
}

.input-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.input-section input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
}

.input-section button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-section button:hover {
  background: #45a049;
}

.summary {
  margin-bottom: 12px;
  font-weight: bold;
}

.error {
  color: #f44336;
}

.warning {
  color: #ff9800;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

tr.error {
  background-color: #ffebee;
}

tr.warning {
  background-color: #fff3e0;
}

tr.success {
  background-color: #e8f5e9;
}

.no-results {
  color: #999;
  text-align: center;
  padding: 20px;
}
</style>
