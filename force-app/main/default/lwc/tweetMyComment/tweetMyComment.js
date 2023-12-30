import { LightningElement,api } from 'lwc';
import LightningModal from 'lightning/modal';
import createComment from '@salesforce/apex/TweetController.createComment';

export default class TweetMyComment extends LightningModal 
{
@api tweetId;
    commentContent;
    handleContentChange(event) {
        this.commentContent = event.target.value;
  }

    handleReply()
    { 
     this.close("Replied"); 
         createComment({ content: this.commentContent, tweetId:this.tweetId})
        .then(() => {
          alert("Replied");
         })
        .catch(error => {
            alert("Failed to reply");
            console.log(error);
        });
        

    }

}