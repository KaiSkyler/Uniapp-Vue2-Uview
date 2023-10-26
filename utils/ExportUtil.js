import {
	optionsUrl
} from "@/config/common/baseUrlConfig";
/**
 * 报价单导出到本地,文件格式为excel
 * @param {*} params 
 */
export const exportQuot = (params = {}) => {
	uni.request({
		url: (optionsUrl.isDebug ? optionsUrl.devUrl : optionsUrl.prodUrl) + '/quot/exportExcel',
		method: 'GET',
		data: params,
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		responseType: 'arraybuffer',
		success: res => {
			if (res.statusCode === 200) {
				const fs = uni.getFileSystemManager();
				let filePath = `${wx.env.USER_DATA_PATH}/` + (params.filename || 'xxx') + '.xlsx'
				fs.writeFile({
					filePath: filePath,
					data: res.data,
					encoding: 'binary',
					success(r1) {
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success(r2) {
								setTimeout(() => {
									uni.hideLoading()
								}, 500)
							}
						})
					}
				})
			}
		},
		fail: (res) => {
			console.log("fail");
		}
	})
}
