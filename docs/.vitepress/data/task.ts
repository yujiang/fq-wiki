import { de } from "element-plus/es/locales.mjs";
import { getCollect } from "./collect";
import { getNpc, getNpcNameAndPosition, getNpcPosition } from "./npc";
import { getScenePositionClient } from "./scene";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";
import { getTrap } from "./trap";


export type TaskDesType = 'item' | 'npc' | 'trap' | '';

export interface TaskParamDes {
    id: number | string;
    type?: TaskDesType; // 支持点击npc
}

export interface XlsTask extends XlsBase {
    GradeSuggest: number; //建议等级
    AcceptDesc: string; //接任务方法

    Type: string;
    Diff: string; // 容易，普通，困难，危险
    Des: TaskParamDes;
    Scene: number;
    NextTask?: number; // 完成自动添加下一个
    Reward?: number;
};


export type Tasks = Record<number, XlsTask>;

let tasks: Tasks;
export async function getTasks() {
    if (!tasks) {
        tasks = (await fetchXls('task')) as Tasks
    }
    return tasks;
}

export async function getTask(id: number) {
    return (await getTasks())[id]
}

export async function getDesDesc(des: TaskParamDes) {
    const desid = des?.id as number;
    if (!desid) {
        return '未知';
    }
    const type = des.type || 'npc'
    let xls: XlsSceneObj
    switch (type) {
        case 'npc':
            {
                xls = await getNpc(desid);
                break;
            }
        case 'item':
            {
                xls = await getCollect(desid);
                break;
            }
        case 'trap':
            {
                xls = await getTrap(desid);
                break;
            }
    }
    if (xls && xls.Scene && xls.x && xls.y) {
        const desc = await getScenePositionClient(xls.Scene,xls.x,xls.y);
        return type === 'trap' ? desc : `${xls.Name} ${desc}`
    }
    return type + ' ' + des.id;
}

function isMain(xls: XlsTask){
    return xls.Tags?.includes("main");
}

// 获得场景下的所有支线任务！
export async function getSceneBranchTasks(scene: number) : Promise<XlsTask[]> {
    const tasks = await getTasks();
    const rt = [];
    for (const task of Object.values(tasks)) {
        // if (task.AcceptDesc){
        //     console.log(task,isMain(task),task.Scene===scene);
        // }
        if (!isMain(task) && task.Scene === scene && task.AcceptDesc && task.GradeSuggest) {
            rt.push(task)
        }
    }
    /// console.log('getSceneBranchTasks',scene, rt)
    return rt;
}