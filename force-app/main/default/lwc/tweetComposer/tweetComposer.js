import { LightningElement } from 'lwc';
import createTweet from '@salesforce/apex/TweetController.createTweet';

export default class TweetComposer extends LightningElement 
{
    tweetContent;
    handleContentChange(event) {
        this.tweetContent = event.target.value;
  }


    handlePost()
    {
         createTweet({ content: this.tweetContent })
        .then(() => {
          this.tweetContent = '';
          alert("Posted");
          window.location.reload();
         })
        .catch(error => {
            alert("Failed to tweet");
            console.log(error);
        });
    }
}