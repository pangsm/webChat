/**
 * Created by yhdj on 2017/9/25.
 */
function showRegister() {

    var reg = document.getElementById("form2");
    var label_reg = document.getElementById("label_reg");
    reg.style.display = "block";
    label_reg.style.display = "block";

    var title = document.getElementById("title");
    title.innerHTML = "Register";

    var login = document.getElementById("form1");
    var label_login = document.getElementById("label_login");
    login.style.display = "none";
    label_login.style.display = "none";
}

function showLogin() {

    var login = document.getElementById("form1");
    var label_login = document.getElementById("label_login");
    login.style.display = "block";
    label_login.style.display = "block";

    var title = document.getElementById("title");
    title.innerHTML = "Login";

    var reg = document.getElementById("form2");
    var label_reg = document.getElementById("label_reg");
    reg.style.display = "none";
    label_reg.style.display = "none";
}

