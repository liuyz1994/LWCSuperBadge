public with sharing class MetadateAPIService {
    public static Boolean createCustomLabel(){
        List<MetadataService.Metadata> allMetadataList = new List<MetadataService.Metadata>();
        MetadataService.CustomLabel label = new MetadataService.CustomLabel();
        label.fullName = 'testLabel1';
        label.language = 'en_US';
        label.protected_x  = false;
        label.shortDescription  = 'a label created by meatadata api';
        label.value= 'xistne kk';
        allMetadataList.add(label);

        MetadataService.MetadataPort service = createService();
        List<MetadataService.SaveResult> results = service.createMetadata(allMetadataList);

        for(MetadataService.SaveResult result: results){
            system.debug('update custom label results success='+result.success);
        }
        return results[0].success;
    }

    public static Boolean addCustomLabelTranslation(){
        List<MetadataService.Metadata> allMetadataList = new List<MetadataService.Metadata>();
        MetadataService.Translations trans = new MetadataService.Translations();
        MetadataService.CustomLabelTranslation label = new MetadataService.CustomLabelTranslation();
        label.label = 'lalala1';
        label.name = 'testLabel1';
        trans.customLabels = new List<MetadataService.CustomLabelTranslation>();
        trans.customLabels.add(label);
        trans.fullName = 'pt_BR';
        allMetadataList.add(trans);
        MetadataService.MetadataPort service = createService();
        List<MetadataService.UpsertResult> results = service.upsertMetadata(allMetadataList);
        system.debug(results[0]);
        return results[0].success;
    }

    public static Boolean updateCustomLabel(){
        List<MetadataService.Metadata> allMetadataList = new List<MetadataService.Metadata>();
        MetadataService.CustomLabel label = new MetadataService.CustomLabel();
        label.fullName = 'testLabel1';
        label.language = 'nl_NL';
        label.protected_x  = false;
        label.shortDescription  = 'a label created by meatadata api';
        label.value= 'HUA';
        allMetadataList.add(label);

        MetadataService.MetadataPort service = createService();
        List<MetadataService.SaveResult> results = service.updateMetadata(allMetadataList);

        return results[0].success;
    }


    private static MetadataService.MetadataPort createService(){ 
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = UserInfo.getSessionId();
        return service; 
    }
}
