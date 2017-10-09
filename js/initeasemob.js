/**
 * Created by yhdj on 2017/9/25.
 */
var conn = null;
var iNow = -1; //��Ϣ��index
var strName = null;
var i = 0;
var rtcCall = null;
var isCall = true;
var loginName = null;
var isEmoji = false;
var emojiStr = null;
//������Ϣ
function dealMsg(message) {
    // var  a = JSON.parse(message);
    console.log("111111112222222222222222222211111111-------------------");

//var obj = JSON.parse(message);
    console.log(message.data + "11111111-----")
    putMsgToGetMsg(1, message.data);
}

function initeasemob() {
    console.log("enter");
    document.getElementsByClassName("sendMsg")[0].disabled = true;
    conn = new WebIM.connection({
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
        url: WebIM.config.xmppURL,
        heartBeatWait: WebIM.config.heartBeatWait,
        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
        autoReconnectInterval: WebIM.config.autoReconnectInterval,
        apiUrl: WebIM.config.apiURL,
        isAutoLogin: true,
    });

    revert();

    conn.listen({
        onOpened: function (message) {          //���ӳɹ��ص�
            // ���isAutoLogin����Ϊfalse����ô�����ֶ��������ߣ������޷�����Ϣ
            // �ֶ�����ָ���ǵ���conn.setPresence(); ���conn��ʼ��ʱ�ѽ�isAutoLogin����Ϊtrue
            // ���������conn.setPresence();
            conn.setPresence();
            console.log("open");
            var loginPage = document.getElementById("center");
            var chat = document.getElementById("chat");
            loginPage.style.display = "none";
            console.log("111111111111111111111");
            chat.style.display = "block";
            getFriends();
        },
        onClosed: function (message) {
            console.log("onClosed");
        },
        //���ӹرջص�
        onTextMessage: function (message) {
            console.log(message);
            dealMsg(message);
        },
        //�յ��ı���Ϣ
        onEmojiMessage: function (message) {

        },
        //�յ�������Ϣ
        onPictureMessage: function (message) {
        }, //�յ�ͼƬ��Ϣ
        onCmdMessage: function (message) {
        },     //�յ�������Ϣ
        onAudioMessage: function (message) {
        },   //�յ���Ƶ��Ϣ
        onLocationMessage: function (message) {
        },//�յ�λ����Ϣ
        onFileMessage: function (message) {
        },    //�յ��ļ���Ϣ
        onVideoMessage: function (message) {
            var node = document.getElementById('privateVideo');
            var option = {
                url: message.url,
                headers: {
                    'Accept': 'audio/mp4'
                },
                onFileDownloadComplete: function (response) {
                    var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                    node.src = objectURL;
                },
                onFileDownloadError: function () {
                    console.log('File down load error.')
                }
            };
            WebIM.utils.download.call(conn, option);
        },   //�յ���Ƶ��Ϣ
        onPresence: function (message) {

        },       //�����㲥���򡰷���-���ġ���Ϣ������ϵ�˶������󡢴���Ⱥ�顢�����ұ��߽�ɢ����Ϣ
        onRoster: function (message) {

        },         //�����������
        onInviteMessage: function (message) {

        },  //����Ⱥ������
        onOnline: function () {
            console.log("success");
        },                  //�����������ӳɹ�
        onOffline: function () {
            console.log("offline");
        },                 //�����������
        onError: function (message) {
            console.log("error");
        },          //ʧ�ܻص�
        onBlacklistUpdate: function (list) {       //�������䶯
            // ��ѯ�����������������ڣ������ѴӺ������Ƴ�����ص����������list���Ǻ��������е����к�����Ϣ
            console.log(list);
        },
        onReceivedMessage: function (message) {

        },    //�յ���Ϣ�ʹ�ͻ��˻�ִ
        onDeliveredMessage: function (message) {

        },   //�յ���Ϣ�ʹ��������ִ
        onReadMessage: function (message) {

        },        //�յ���Ϣ�Ѷ���ִ
        onCreateGroup: function (message) {

        },        //����Ⱥ��ɹ���ִ�������createGroupNew��
        onMutedMessage: function (message) {

        }        //����û���AȺ�鱻���ԣ���AȺ����Ϣ��������ص�������Ϣ���ᴫ�ݸ�Ⱥ������Ա
    });


    //��ʼ��WebRTC Cal
    rtcCall = new WebIM.WebRTC.Call({
        connection: conn,
        mediaStreamConstaints: {
            audio: true,
            video: true
        },

        listener: {
            onAcceptCall: function (from, options) {
                console.log('onAcceptCall::', 'from: ', from, 'options: ', options);
                //showCall();
            },
            //ͨ��streamType������Ƶ������Ƶ����streamType: 'VOICE'(��Ƶ��)��'VIDEO'(��Ƶ��)
            onGotRemoteStream: function (stream, streamType) {
                console.log('onGotRemoteStream::', 'stream: ', stream, 'streamType: ', streamType);
                var video = document.getElementById("video");
                //  console.log("onGotRemoteStream------------------------------" + video);
                video.srcObject = stream;
            },
            onGotLocalStream: function (stream, streamType) {
                console.log('onGotLocalStream::', 'stream:', stream, 'streamType: ', streamType);
                var localVideo = document.getElementById("localVideo");
                console.log("onGotRemoteStream" + video.width);
                localVideo.srcObject = stream;
            },
            onRinging: function (caller) {
                console.log('onRinging::', 'caller:', caller);
                showCall();
            },
            onTermCall: function (reason) {
                console.log('onTermCall::');
                console.log('reason:', reason);
            },
            onIceConnectionStateChange: function (iceState) {
                console.log('onIceConnectionStateChange::', 'iceState:', iceState);
                if (iceState == "closed") {
                    closeCall();
                }
            },
            onError: function (e) {
                console.log(e);
            }
        }
    });


}


function revert() {
    var loginPage = document.getElementById("center");
    var chat = document.getElementById("chat");
    loginPage.style.display = "block";
    chat.style.display = "none";
}

//��¼

function login() {
    var username = document.getElementById("usernameLogin");
    var password = document.getElementById("passwordLogin");
    loginName = username;
    var usernameLogin = username.value;
    var passwordLogin = password.value;
    //alert(usernameLogin + passwordLogin);
    loginEasemob(usernameLogin, passwordLogin);

}


function loginEasemob(usernameLogin, passwordLogin) {
    console.log(usernameLogin + passwordLogin);
    var options = {
        apiUrl: WebIM.config.apiURL,
        user: usernameLogin,
        pwd: passwordLogin,
        appKey: WebIM.config.appkey,

    };
    conn.open(options);
}


//ע��
function register() {
    var reg_name = document.getElementById("username").value;
    var reg_password = document.getElementById("password").value;
    var options = {
        username: reg_name,
        password: reg_password,
        nickname: reg_name,
        appKey: WebIM.config.appkey,
        success: function () {
            alert("success");
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        },
        error: function () {
            alert("fail");
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        },
        apiUrl: WebIM.config.apiURL
    };
    conn.registerUser(options);
}

function getInputMessage() {
    var message = document.getElementById("message");
    var msg = message.value;
    emojiStr = msg;
    message.value = "";
    // alert(msg);
    putMsgToGetMsg(0, msg);
    // ���ķ����ı���Ϣ
    sendPrivateText(msg);

}

function sendPrivateText(message) {
    console.log(strName + "sendmsg--------------------------------------");
    if (isEmoji) {
        message = dealEmoji();
        console.log("send=======" + message);
        isEmoji = !isEmoji;
    }
    var id = conn.getUniqueId();                 // ���ɱ�����Ϣid
    var msg = new WebIM.message('txt', id);      // �����ı���Ϣ
    msg.set({
        msg: message,                  // ��Ϣ����
        to: strName,          // ������Ϣ�����û�id��
        roomType: false,
        success: function (id, serverMsgId) {
            console.log('send private text Success');
        },
        fail: function (e) {
            console.log("Send private text error");
        }
    });
    msg.body.chatType = 'singleChat';
    conn.send(msg.body);

}

//��ȡ������ϵ��
function getFriends() {
    conn.getRoster({
        success: function (roster) {
            //��ȡ�����б������к����б���Ⱦ��roster��ʽΪ��
            /** [
             {
               jid:'asemoemo#chatdemoui_test1@easemob.com',
               name:'test1',
               subscription: 'both'
             }
             ]
             */
            for (var i = 0; i < roster.length; i++) {
                var ros = roster[i];
                //ros.subscriptionֵΪboth/toΪҪ��ʾ����ϵ�ˣ��˴���APP�豣��һ�£����ܱ�֤�����ͻ��˵�¼��ĺ����б�һ��
                if (ros.subscription === 'both' || ros.subscription === 'to') {
                    console.log(ros.name + "1");
                    writeFriendsIntoLi(ros.name);
                }
            }
            console.log(roster + "2");
        },
    });
}


//����ϵ��д��li����
function writeFriendsIntoLi(name) {
    console.log(name + "  name3");
    var contactList = document.getElementById("contactList");
    var str = '';
    str += '<li> <a onclick="getUsername(strName);">' + name + '</a> </li>'; //ƴ��str
    console.log(str + "4");
    contactList.innerHTML += str;
}


//�յ���Ϣʱ����Ϣ���ݷ���getMsg��
function putMsgToGetMsg(isSendOrReceive, msgContent) {
    if (isEmoji) {
        console.log("dealEmoji" + dealEmoji());
        msgContent = dealEmoji();

        console.log("msg = " + msgContent);
    }
    var content = document.getElementById("content");
    var img = content.getElementsByTagName('img');
    var span = content.getElementsByTagName('span');
    content.innerHTML += '<li><img src="images/headImgs/a4.jpg"><span>' + msgContent + '</span></li>';
    iNow++;
    //0������Ϣ
    if (isSendOrReceive == 0) {
        console.log("right");
        img[iNow].className += 'imgright';
        span[iNow].className += 'spanright';
    }
    if (isSendOrReceive == 1) {//
        console.log("left");
        img[iNow].className += 'imgleft';
        span[iNow].className += 'spanleft';
    }

}


//��ȡ��ϵ������
function getUsername(name) {
    var str = null;
    var index = -1;
    var contactList = document.getElementById("contactList");
    var list = contactList.getElementsByTagName("li");
    for (var i = 0, len = list.length; i < len; i++) {
        var that = list[i];
        list[i].onclick = (function (k) {
            var info = that.innerHTML;
            return function () {
                // alert(k + "----" + info);
                str = info.replace('</a>', '');
                index = str.lastIndexOf('>')
                console.log(index);
                str = str.substring(index + 1);
                str = trim(str);
                strName = str;
                console.log(str + "yyyyyyyyyyyyyyyyyyyyyyy" + strName);

                document.getElementsByClassName("sendMsg")[0].disabled = false;
                var writeToUsername = document.getElementById("writeToUsername");
                writeToUsername.innerHTML = "chat with " + str;

            };
        })(i);
    }


    //alert(name);

}


//��Ӻ���
function addFriends() {
    console.log("addfriend");
    var addFriend = document.getElementById("addFriend");
    var addFriend_link = document.getElementById("addFriend_link");
    var chat = document.getElementById("chat");
    addFriend_link.style.display = "block";
    chat.style.opacity = "0.4";
}


//�ر�ģ̬����
function closeWindow() {
    //��ȡ�û���д����Ӻ��ѵ���Ϣ
    var friendName = document.getElementById("friendName").value;
    var friendRemark = document.getElementById("friendRemark").value;
    console.log(friendName + friendRemark + "2222222222222222222222222222222222");


// ��Ӻ���

    conn.subscribe({
        to: friendName,
        // Demo������շ�û��չ�ֳ������message����status�ֶ�����
        message: friendRemark
    });


    getFriends();


    addFriend_link.style.display = "none";
    chat.style.opacity = "1";


}

//����ո�
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


//�ӵ绰ҳ��
function showCall() {
    var callBox = document.getElementById("callBox");
    i++;
    if (i % 2 == 1) {
        callBox.style.display = "block";
    } else {
        callBox.style.display = "none";
    }
}


//��Ƶͨ��
function videoCall() {
    //rtcCall.caller = 'chenjiahao';
    //rtcCall.makeVideoCall('asdfghj');
    //
    //var callBox = document.getElementById("callBox");
    //i++;
    //if (i % 2 == 1) {
    //    callBox.style.display = "block";
    //} else {
    //    callBox.style.display = "none";
    //}
    var video = document.getElementById("video");
    var localVideo = document.getElementById("localVideo");
    if (isCall) {
        // ���ܶԷ�����
        video.style.display = "block";
        localVideo.style.display = "block";
        rtcCall.caller = loginName;
        rtcCall.makeVideoCall(strName);
    } else {
        // �ص�/�ܾ�
        video.style.display = "none";
        localVideo.style.display = "none";
        rtcCall.endCall();

    }
    isCall = !isCall;

}

//����ͨ��
function acceptCall() {
    var video = document.getElementById("video");
    var localVideo = document.getElementById("localVideo");
    video.style.display = "block";
    localVideo.style.display = "block";
    var callBox = document.getElementById("callBox");

    callBox.style.display = "none";

    rtcCall.acceptCall();


}

//关闭通话�
function closeCall() {
    var callBox = document.getElementById("callBox");
    var video = document.getElementById("video");
    var localVideo = document.getElementById("localVideo");
    callBox.style.display = "none";
    video.style.display = "none";
    localVideo.style.display = "none";
    rtcCall.endCall();

}


//展示表情
function showFace() {
    isEmoji = true;
    console.log("enterface");
    $('.emoji').qqFace({

        id: 'facebox',

        assign: 'message',

        path: 'images/arclist/'	//表情存放的路径

    });

    console.log("exsit");

    //$(".sub_btn").click(function(){
    //
    //    var str = $("#saytext").val();
    //
    //    alert(replace_em(str));
    //
    //    $("#show").html(replace_em(str));
    //
    //});
}


//解析表情并写进消息列表
function dealEmoji() {

    var str;
    console.log("msg" + emojiStr);
    str = emojiStr.toString().replace("[em_", '');
    str = str.toString().replace("]", '');
    // console.log("str = " + str);
    //return '<img src="images/arclist/'+str+'.gif"> </img>';
//return '<img src="images/arclist/1.gif">'
    console.log("str = " + str);
    console.log("return" + "<img src='images/arclist/" + trim(str) + ".gif'>");
    return "<img src='images/arclist/" + trim(str) + ".gif'>";
}














