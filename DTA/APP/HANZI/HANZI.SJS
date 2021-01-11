[
	TEXT/SJS
]
SET WINDOW-HTML AS
~[
<div class="ids"><iframe class="hanzi-Iframe" src="" frameborder="no"></iframe>
    <fieldset class="input-Field">
        <legend><LANG?Input?LANG></legend>
        <div><input type="text" class="ids-Input">
            <div class="none-Select create-Button _window_button"
                onclick="<JS?SEARCH-HANZI @LEFT-BRACKET@THIS@RIGHT-BRACKET@?JS>"><LANG?Search?LANG></div>
        </div>
    </fieldset>
</div>
~]
SET HANZI-WINDOW AS NEW M-WINDOW[@<BASIC-FUNCTION>.GET-INTERFACE-TEXT["-NEW -SEARCH"], WINDOW-HTML, |[800, 600]|]
HANZI-WINDOW.CREATE-WINDOW[]

->
REM @EXPORT<SEARCH-HANZI>
SET SEARCH-HANZI AS FUNCTION WITH WINDOW IN

SET M-WINDOW AS $[WINDOW]
SET INPUT-BAR AS M-WINDOW.PARENT[].CHILDREN[".IDS-INPUT"]
SET MIFRAME AS M-WINDOW.PARENT[].PARENT[].PARENT[].CHILDREN[".HANZI-IFRAME"]
MIFRAME.ATTR["SRC", "-P-H-P/GETZI.PHP?-T=" + INPUT-BAR|[0]|.VALUE]
CONSOLE.LOG[M-WINDOW]

END SEARCH-HANZI
<-