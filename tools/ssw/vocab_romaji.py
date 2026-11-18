# -*- coding: utf-8 -*-
def kk2h(s): return "".join(chr(ord(c)-0x60) if "ァ"<=c<="ヶ" else c for c in s)
R = {"あ":"a","い":"i","う":"u","え":"e","お":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ま":"ma","み":"mi","む":"mu","め":"me","も":"mo","や":"ya","ゆ":"yu","よ":"yo","ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro","わ":"wa","を":"o","ん":"n","が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do","ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po"}
SM = {"ゃ":"ya","ゅ":"yu","ょ":"yo"}
def romaji(k):
    k = kk2h(k); out = []; i = 0; sok = False
    while i < len(k):
        c = k[i]
        if c == "っ": sok = True; i += 1; continue
        if c == "ー":
            if out: out.append(out[-1][-1])
            i += 1; continue
        r = R.get(c, c)
        if i+1 < len(k) and k[i+1] in SM:
            r = r[:-1] + ("" if r.endswith("i") and r in ("shi","chi","ji") else "y")+ SM[k[i+1]][1:] if r not in ("shi","chi","ji") else r[:-1] + SM[k[i+1]][1:]
            if c in "しちじ": r = {"し":"sh","ち":"ch","じ":"j"}[c] + SM[k[i+1]][1:]
            i += 1
        if sok: r = r[0] + r; sok = False
        out.append(r); i += 1
    return "".join(out)

