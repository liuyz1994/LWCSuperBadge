trigger AccountTrigger on Account (before insert) {
    if (Trigger.isBefore && Trigger.isInsert){
        preventDuplicate();
    }

    private void preventDuplicate(){
        Set<String> names  = new Set<String>();
        for (Account acc : Trigger.new){
            if (acc.IsActive && !names.containsKey(acc.parentId)){
                names.put(acc.parentId);
            } else {
                acc.addError('duplicate');
            }
        }

        Set<String> duplicateName = new Set<String>();
        for (Account acc: [SELECT Id, Name FROM Account WHERE Name IN :names]){
            duplicateName.add(acc.Name);
        }

        for (Account acc : Trigger.new){
            if (duplicateName.contains(acc.Name)){
                acc.addError('duplicate');
            }
        }
    }
}

