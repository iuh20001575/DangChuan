const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function ChuanCSDL(quanHeInput, phuThuocHamInput) {

    function handlerInputPhuThuocHam(value) {
        const specialCharacters = '®';
        var result = '';
        for (var i = 0; i < value.length; i++)
            if (value[i] === ' ')
                continue;
            else if ((value[i].toUpperCase() >= 'A' && value[i].toUpperCase() <= 'Z') || value[i] === ';')
            result += value[i].toUpperCase();
        else if (value[i] === ',')
            result += ';';
        else
            result += specialCharacters;
        return result;
    }

    function handlerInputQuanHe(value) {
        let quanHe = '';
        for (var i of value)
            if (i.toUpperCase() >= 'A' && i.toUpperCase() <= 'Z')
                quanHe += i.toUpperCase();
        return quanHe;
    }

    function tapCon(TG) {
        function decToBin(a) {
            var s = '';
            while (a > 0) {
                s = (a % 2) + s;
                a /= 2;
                a = parseInt(a);
            }
            return s;
        }

        function hamSinh(a) {
            var arr = [];
            for (var i = 0; i <= 2 ** a - 1; i++) {
                var res = decToBin(i);
                while (res.length < a)
                    res = 0 + res;
                arr.push(res);
            }
            return arr;
        }

        var allTH = hamSinh(TG.length);
        var array = [];
        allTH.forEach(element => {
            var res = '';
            for (var i = 0; i < element.length; i++)
                if (element[i] === '1')
                    res += TG[i];
            array.push(res);
        })
        return array;
    }

    function include(s1, s2) {
        var arrS2 = [...s2.split('')];
        for (var i = 0; i < s2.length; i++)
            if (!s1.includes(arrS2[i]))
                return false;
        return true;
    }

    function includeArray(arr, key) {
        for (var i = 0; i < arr.length; i++)
            if (include(key, arr[i]))
                return true;
        return false;
    }

    function checkPhuThuocHam(x0, f, check) {
        for (var i = 0; i < f.length; i++) {
            if (include(x0, f[i][0]) && !check.includes(i)) {
                check.push(i);
                return f[i][1];
            }
        }
    }

    function getBaoDong(baoDong, f) {
        let check = [];
        while (true) {
            res = checkPhuThuocHam(baoDong, f, check);
            if (!res)
                break;
            baoDong += res;
            baoDong = Array.from(new Set(baoDong.split(''))).join('');
        }
        return [...(new Set(baoDong.split('')))].join('');
    }

    function addSet(arr, element) {
        for (var i of arr)
            if (i[0] === element[0] && i[1] === element[1])
                return false;
        return true;
    }

    function tach1ThuocTinhObj(arrayThuocTinh) {

        let res = [];
        arrayThuocTinh.forEach(e => {
            for (var i = 0; i < e[1].length; i++)
                if (addSet(res, [e[0], e[1][i]]))
                    res.push([e[0], e[1][i]]);
        })
        return res;
    }

    function getFToArray(arr) {
        res = '';
        for (var i of arr)
            res += `${i[0]}->${i[1]}; `;
        return res;
    }

    function isChuanBCNF(F, sieuKhoa) {
        for (var i of F)
            if (!sieuKhoa.includes(i[0]))
                return `
                    Xét ${i[0]}->${i[1]} có ${i[0]} không là siêu khóa
                    => Q không đạt chuẩn BCNF
                `;
    }

    function isChuan3NF(F, khoaArr, sieuKhoa) {
        for (var i of F) {
            var check3NF = khoaArr.find(e => e.includes(i[1]));
            if (!check3NF && !sieuKhoa.includes(i[0]))
                return `
                    Xét ${i[0]}->${i[1]} có ${i[0]} không là siêu khóa và ${i[1]} không là thuộc tính khóa
                    => Q không đạt chuẩn 3NF
                `;
        }
    }

    var quanHe = handlerInputQuanHe(quanHeInput);
    var phuThuocHam = handlerInputPhuThuocHam(phuThuocHamInput);
    var TN = phuThuocHam => {
        let phuThuocHamObj = phuThuocHam.split(';').map(element => element.split('®'));
        return phuThuocHamObj;
    }
    var VT = TN(phuThuocHam)
        .map(element => element[0]).reduce((a, b) => a + b, '');
    var VP = TN(phuThuocHam)
        .map(element => element[1]).reduce((a, b) => a + b, '');
    var tapNguon = '';
    var trungGian = '';
    var checkBCNF = [];
    var check3NF = [];
    var F = tach1ThuocTinhObj(phuThuocHam.split(';').map(e => e.split('®')));

    for (var i of quanHe)
        if (VT.includes(i) && VP.includes(i))
            trungGian += i;
        else
    if (!VT.includes(i) && !VP.includes(i))
        tapNguon += i;
    else if (VT.includes(i) && !VP.includes(i))
        tapNguon += i;

    $('.tap-nguon').innerHTML = `TN = {${tapNguon}}`;
    $('.trung-gian').innerHTML = `TG = {${trungGian}}`;

    const table = $('.table tbody');
    var tableForm = '';
    let keyArray = [];
    tapCon(trungGian).forEach(element => {
        let nguonHopTG = element + tapNguon;
        let layBaoDong = getBaoDong(nguonHopTG, phuThuocHam
            .split(';').map(e => e.split('®')));
        let isSieuKhoa = !!(layBaoDong.length === quanHe.length);
        let isKhoa = false;
        if (isSieuKhoa && !includeArray(keyArray, nguonHopTG)) {
            isKhoa = true;
            keyArray.push(nguonHopTG);
        }
        tableForm += `
            <tr>
                <td>${element === '' ? 'ꬹ' : element}</td>
                <td>${nguonHopTG}</td>
                <td>${layBaoDong}</td>
                <td>${isSieuKhoa ? nguonHopTG : ''}</td>
                <td>${isKhoa ? nguonHopTG : ''}</td>
            </tr>
        `;
        if (isSieuKhoa)
            checkBCNF.push(nguonHopTG);
        if (isKhoa)
            check3NF.push(nguonHopTG);
    });
    table.innerHTML = tableForm;
    $('.buoc-2').innerHTML = `F = {${getFToArray(F)}}`;

    var xacDinhDangChuan = '';

    if (isChuanBCNF(F, checkBCNF)) {
        xacDinhDangChuan += isChuanBCNF(F, checkBCNF);
        if (isChuan3NF(F, check3NF, checkBCNF)) {
            xacDinhDangChuan += `\n` + isChuan3NF(F, check3NF, checkBCNF);
        } else
            xacDinhDangChuan += `\n...\nĐạt chuẩn 3NF`;

        $('.buoc-3').innerText = xacDinhDangChuan;
    } else
        $('.buoc-3').innerText = `...\nĐạt chuẩn BCNF`;
}

$('button').onclick = () => {
    $('.table').innerHTML = `
        <thead>
            <tr>
                <th scope="col">Xi</th>
                <th scope="col">Xi U TN</th>
                <th scope="col">(Xi U TN)+</th>
                <th scope="col">Siêu khóa</th>
                <th scope="col">Khóa</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    ChuanCSDL($('#quan-he').value, $('#phu-thuoc-ham').value);
}