import { LightningElement } from 'lwc';
import createTweet from '@salesforce/apex/TweetController.createTweet';

export default class TweetComposer extends LightningElement 
{
    tweetContent;
    handleContentChange(event) {
        this.tweetContent = event.target.value;
  }

    handleSubmit()
    {
         createTweet({ content: this.tweetContent })
        .then(() => {
          this.tweetContent = '';
         })
        .catch(error => {
            alert("Enter Tweet Content");
        });
    }
}