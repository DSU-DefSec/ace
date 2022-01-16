Option Explicit
If WScript.Arguments.length = 0 Then
   Dim objShell : Set objShell = CreateObject("Shell.Application")
   objShell.ShellExecute "wscript.exe", Chr(34) & _
   WScript.ScriptFullName & Chr(34) & " uac", "", "runas", 1
Else   
   Dim WshShell, objFSO, strNow, intServiceType, intStartupType, strDisplayName, iSvcCnt
   Dim sREGFile, sBATFile, r, b, strComputer, objWMIService, colListOfServices, objService   
   Set WshShell = CreateObject("Wscript.Shell")
   Set objFSO = Wscript.CreateObject("Scripting.FilesystemObject")
   
   strNow = Year(Date) & Right("0" & Month(Date), 2) & Right("0" & Day(Date), 2)
   
   Dim objFile: Set objFile = objFSO.GetFile(WScript.ScriptFullName)  
   sBATFile = objFSO.GetParentFolderName(objFile) & "\svc_curr_state_" & strNow & ".bat"
   
   
   
   Set b = objFSO.CreateTextFile (sBATFile, True)
   b.WriteLine "@echo Restore Service Startup State saved at " & Now
   b.WriteBlankLines 1
   
   strComputer = "."
   iSvcCnt=0
   Dim sStartState, sSvcName, sSkippedSvc
   Set objWMIService = GetObject("winmgmts:" _
   & "{impersonationLevel=impersonate}!\\" & strComputer & "\root\cimv2")
   
   Set colListOfServices = objWMIService.ExecQuery _
   ("Select * from Win32_Service")
   
   For Each objService In colListOfServices
      iSvcCnt=iSvcCnt + 1
      sStartState = lcase(objService.StartMode)
      sSvcName = objService.Name
      Select Case sStartState
         Case "boot"
         
         b.WriteLine "sc.exe config " & sSvcName & " start= boot"
         
         Case "system"
         b.WriteLine "sc.exe config " & sSvcName & " start= system"
         
         Case "auto"
         'Check if it's Automatic (Delayed start)  
         If objService.DelayedAutoStart = True Then
            b.WriteLine "sc.exe config " & sSvcName & " start= delayed-auto"
         Else
            b.WriteLine "sc.exe config " & sSvcName & " start= auto"
         End If
         
         Case "manual"
         
         b.WriteLine "sc.exe config " & sSvcName & " start= demand"
         
         Case "disabled"
         
         b.WriteLine "sc.exe config " & sSvcName & " start= disabled"
         
         Case "unknown"	sSkippedSvc = sSkippedSvc & ", " & sSvcName
         'Case Else
      End Select
   Next
   
   If trim(sSkippedSvc) <> "" Then
      WScript.Echo iSvcCnt & " Services found. The services " & sSkippedSvc & " could not be backed up."
   Else
      WScript.Echo iSvcCnt & " Services found and their startup configuration backed up."
   End If
   
   b.WriteLine "@pause"
   b.Close
   WshShell.Run "notepad.exe " & sBATFile
   Set objFSO = Nothing
   Set WshShell = Nothing
End If