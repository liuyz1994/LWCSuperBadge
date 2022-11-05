import { LightningElement, api, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';


// ...
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

const col = [
    {label: 'Name', fieldName: 'Name', type: 'text', editable: true },
    {label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
    {label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
    {label: 'Description', fieldName: 'Description__c', type: 'text', editable: true },
  ]
export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = col;
  @api boatTypeId = '';
  @api boats;
  isLoading = false;
  error = undefined;
  rowOffset = 0;
  draftValues = [];
  
  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method 
  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats(result) { 
    this.boats = result;
    console.log('data', this.boats);
    if (result.error){
        this.boats = result.error;
        this.boats = undefined;
    }
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }
  
  // public function that updates the existing boatTypeId propert
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
      this.isLoading = true;
      this.boatTypeId = boatTypeId;
      this.notifyLoading(this.isLoading).then(() => {
        this.draftValues = [];
      });
   }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
   @api
  async refresh() { 
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
   }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  
  async handleSave(event) {
    // notify loading
    this.notifyLoading(this.isLoading);
    const updatedFields = event.detail.draftValues;

    updateBoatList({data: updatedFields})
    .then((result) => {
      const evt = new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: MESSAGE_SHIP_IT,
        variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(evt);
      this.draftValues = [];
    })
    .catch(error => {
        const evt = new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.body.message,
          variant: ERROR_VARIANT
        });
        this.dispatchEvent(evt);
    })
    .finally(() => {
      this.refresh();
    });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) { 
    const eventName = isLoading? 'loading' : 'doneloading';
    this.dispatchEvent(new CustomEvent(eventName));
  }

  showNotification(title, message, variant) {
    const evt = new ShowToastEvent({
        title,
        message,
        variant
    });
    this.dispatchEvent(evt);
}
}