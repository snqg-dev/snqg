<template>
	<view :style="{position: 'fixed', zIndex: 9999, top: 0, left: 0, width: '100%'}">
		<top-bar :returnAble="returnAble" :title="title"></top-bar>
	</view>
	<view :style="{marginTop: navBarHeight + 45 + 'px'}">
		<view v-if="!loading_visible">
      <!-- 不要删这段代码，这是运行时的逻辑 -->
			<my_login v-if="state == 0"></my_login>
			<!-- <my_bind v-else-if="state == 1"></my_bind> -->
			<slot name="content" v-else></slot>
      <!-- <slot name="content"></slot> -->
		</view>
		<nut-dialog teleport="#app" title="加载中..." content="请稍后" noOkBtn="true" noCancelBtn="true"
			v-model:visible="loading_visible">
		</nut-dialog>
	</view>

	<view>
		<view v-if="calling === 1">
			<call-state></call-state>
		</view>
	</view>

</template>

<script>
	import user from '../../store/user.js';
	import axios from '../../utils/http.js';
	const app = getApp();

	export default {

		name: "top-bar-container",
		props: {
			returnAble: {
				type: Boolean,
				default: false
			}, //是否显示返回icon
			title: {
				type: String,
				default: ''
			}, //文字标题
		},
		data() {
			return {
				navBarHeight: app.globalData.navBarHeight,
				loading_visible: true,
				state: 0,
				calling: 0,
				// interval: "",
			};
		},
		mounted() {
			//console.log(0)
			this.loading_visible = true;
			this.updateState();

			setTimeout(() => {
				this.loading_visible = false;
			}, 1000);

			var _this = this;
			uni.$on("updateState", function(data) {
				// console.log(12)
				_this.updateState();
			});

			user.check();

			let that = this;
      //TODO: 这里是全局轮询获取信息
			// setInterval(() => {
			// 	this.polling()
			// }, 5000);

		},

		methods: {
			polling: function() {
				let that = this;
				console.log("calling:" + this.calling)
				if (that.calling === 1) {
					// clearInterval(that.data.interval);
				};
				axios.request({
					method: 'GET',
					url: "api/call/state",
					params: {
						'token': user.getToken()
					},
				}).then(res => {
					if (res.code === 200) {
						that.calling = res.data.calling;
					} else {
						that.calling = 0;
					}
				});
				// console.log(2223);
			},
			updateState: function() {
        console.log("pre state:" + this.state)
				const _this = this;
				let lastState = this.state;
				let currentState = user.getState();
				this.state = currentState;
				console.log("state:" + this.state)

				if (lastState != this.state)
					uni.$emit("refresh", {});
			},
		},
	}
</script>

<style scoped>

</style>
