// import {baseUrl} from"@/core/core.js";
import {
	optionsUrl
} from "@/config/common/baseUrlConfig";
import {
	getImageInfo,
	getFileInfo
} from '@/utils/uniApi.js'
import crypto from 'crypto-js';
import {
	Base64
} from 'js-base64/base64';
import $store from '@/store/index.js'
import $api from '@/config/request/index.js'

const baseUrl = optionsUrl.prodUrl;
const tstUrl = baseUrl + '/aliyun/getTstCredentials';


async function getAliTstInfo() {
	let [err, res] = await uni.request({
		url: tstUrl,
		header: {
			'token': $store.state.user.authorization.token
		},
	});
	return res;
}

function computeSignature(accessKeySecret, policy) {
	return crypto.enc.Base64.stringify(crypto.HmacSHA1(policy, accessKeySecret));
}

function createName() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export async function uploadOss(filePath) {
	let resp = await getAliTstInfo();

	let data = resp.data.data;

	let bucket = "onshelf-public";
	let area = "oss-cn-shanghai";
	let savePath = "images";

	let fileType = filePath.split(".").pop();
	let fileName = createName();
	let filename = savePath + "/" + fileName + "." + fileType;

	const date = new Date();
	date.setHours(date.getHours() + 1);
	const policyText = {
		expiration: date.toISOString(), // 设置policy过期时间。
		conditions: [
			["content-length-range", 0, 1024 * 1024 * 1024],
		],
	};

	const policy = Base64.encode(JSON.stringify(policyText)) // policy必须为base64的string。

	const signature = computeSignature(data.accessKeySecret, policy)

	const formData = {
		OSSAccessKeyId: data.accessKeyId,
		signature,
		policy,
		'x-oss-security-token': data.securityToken,
		key: filename,
		success_action_status: 200
	}
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: "https://" + bucket + "." + area + ".aliyuncs.com",
			filePath,
			name: 'file',
			formData,
			success: (res) => {
				let ossUrl = "https://" + bucket + "." + area + ".aliyuncs.com/" +
					filename;

				// 资源管理 》新增文档
				getFileInfo(filePath).then(res => {
					$api.companyApi.addDoc({
						compID: $store.state.company.compID,
						url: ossUrl,
						fileName: fileName,
						fileType: fileType,
						orgName: '',
						size: res.size
					})
				})

				resolve(ossUrl);
			},
			fail(e) {
				reject(e);
			}
		})
	})


}
