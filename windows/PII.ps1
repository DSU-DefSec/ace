$format = @("\b\d{3}-\d{2}-\d{4}\b")

foreach ($num in $format)
{
    Get-ChildItem -Path "C:\" -Recurse -Include "*.txt","*.csv","*.docx" -ErrorAction SilentlyContinue |
    Select-String -Pattern $num | 
    Select Path, LineNumber
}
