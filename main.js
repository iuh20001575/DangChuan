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

    function tach1ThuocTinh(arrayThuocTinh) {
        let res = '';
        arrayThuocTinh.forEach(e => {
            for (var i = 0; i < e[1].length; i++)
                res += `${e[0]}->${e[1][i]}; `;
        })
        return res;
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
    for (var i of quanHe)
        if (VT.includes(i) && VP.includes(i))
            trungGian += i;
        else if (!VT.includes(i) && !VP.includes(i))
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
    });
    table.innerHTML = tableForm;
    $('.buoc-2').innerHTML = `F = {${tach1ThuocTinh(phuThuocHam.split(';').map(e => e.split('®')))}}`;
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