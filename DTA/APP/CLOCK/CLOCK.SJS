[
	TEXT/SJS
]
REM DEBUGGER
SET WINDOW-HTML AS
~[
<div class="clock">
	<div class="led"><img id="i0" src="0.GIF"  ></div>
	<div class="led"><img id="i1" src="0.GIF"  ></div>
	<div class="lS" ><img src="IMG/CLOCK/S.GIF"></div>
	<div class="led"><img id="i2" src="0.GIF"  ></div>
	<div class="led"><img id="i3" src="0.GIF"  ></div>
	<div class="lS" ><img src="IMG/CLOCK/S.GIF"></div>
	<div class="led"><img id="i4" src="0.GIF"  ></div>
	<div class="led"><img id="i5" src="0.GIF"  ></div>
</div>
~]

SET PREFIX-ZERO AS FUNCTION WITH NUM, N IN
	RETURN [-ARRAY[N].JOIN[0] + NUM].SLICE[- N]
END PREFIX-ZERO

SET CHANGE-LED AS FUNCTION WITH STR IN
	REM CONSOLE.LOG(STR)
	FOR SET I AS 0 TO STR.LENGTH
		$["#I" + I].ATTR("SRC", "IMG/CLOCK/" + STR|[I]| + ".GIF");
	NEXT
END CHANGE-LED

SET D AS 0

SET FLASH-LED AS FUNCTION WITH NONE IN
	D IS NEW -DATE[]
	CHANGE-LED[
		PREFIX-ZERO[D.GET-HOURS  [].TO-STRING[], 2] +
		PREFIX-ZERO[D.GET-MINUTES[].TO-STRING[], 2] +
		PREFIX-ZERO[D.GET-SECONDS[].TO-STRING[], 2]
	]
END FLASH-LED

SET CLOCK-WINDOW AS NEW M-WINDOW[
	@<BASIC-FUNCTION>.GET-INTERFACE-TEXT["-CLOCK"],
	WINDOW-HTML,
	|[400, 148]|,
	|[
		|["UNZOOMABLE"]|,
		|["UNMAXIMUMABLE"]|,
		|[
			"ON-CLOSE",
			SET ANONYMOUS-FUNCTION WITH ID IN
				RETURN [
					SET ANONYMOUS-FUNCTION WITH NONE IN
						CLEAR-INTERVAL[ID]
					END ANONYMOUS-FUNCTION
				]
			END ANONYMOUS-FUNCTION WITH SET-INTERVAL[FLASH-LED, 1000] IN
		]|
	]|
]
CLOCK-WINDOW.CREATE-WINDOW[]