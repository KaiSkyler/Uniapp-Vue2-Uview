// 引入vue
import vm from "vue";
// notify组件
import notify from "@/component/com-notice/com-notice.vue";

export default {
    /**
     * 全局notify弹窗
    */
    notify(){
        // 全局注册notify组件
        const notifyCom = vm.component('notify',notify);
        // 获取uniapp根节点
        const uniappRoot = document.getElementsByTagName("uni-app")[0];
        // 初始化notify组件
		const notifyComp = new notifyCom();
        // 这里我每个组件内都有一个固定id，用来禁止同意组件生成多次
		if(document.getElementById(notifyComp.id)){
			document.getElementById(notifyComp.id).remove();
		}
        // 将notify组件添加在uniapp根节点上
		uniappRoot.appendChild(notifyComp.$mount().$el);
		return notifyComp;
    }
}