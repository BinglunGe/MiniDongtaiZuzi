[
	TEXT/SJS
]
@WITH>METAINF.INI<

SET WINDOW-PAGE AS @GET>NEWUSER.UIT<
SET USER-HTML AS "<DIV STYLE='<CSS?OVERFLOW: AUTO; HEIGHT: 100%; PADDING: 1PX;?CSS>'><TEXT?UITEXT-HANDLE[WINDOW-PAGE]?TEXT></DIV>"
SET LOGIN-WINDOW AS NEW M-WINDOW[@<BASIC-FUNCTION>.GET-INTERFACE-TEXT["-NEW -CONVERT"], USER-HTML, |[800, 600]|]
LOGIN-WINDOW.CREATE-WINDOW[]