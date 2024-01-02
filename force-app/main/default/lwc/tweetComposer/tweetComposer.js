import { LightningElement } from 'lwc';
import createTweet from '@salesforce/apex/TweetController.createTweet';

export default class TweetComposer extends LightningElement 
{
    tweetContent;
    remainingCharacters=160;
    handleContentChange(event) 
    {
        this.tweetContent = event.target.value;
        this.remainingCharacters = 160 - this.tweetContent.length;
    }


    handlePost()
    {
         createTweet({ content: this.tweetContent })
        .then(() => {
          this.tweetContent = '';
          this.remainingCharacters=160;
          alert("Posted");
         })
        .catch(error => {
            alert("Failed to tweet");
            console.log(error);
        });
    }
}