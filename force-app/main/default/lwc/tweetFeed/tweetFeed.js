import { LightningElement,wire } from 'lwc';
import  getTweets  from '@salesforce/apex/TweetController.getTweets';
import  createRetweet  from '@salesforce/apex/TweetController.createRetweet';
import likeTweet from '@salesforce/apex/TweetController.likeTweet';
import TweetMyComment from 'c/tweetMyComment';
export default class TweetFeed extends LightningElement 
{   tweets;
    error;
    loading = true;
   
    @wire(getTweets)
    wiredData({ e, data }) {
        if (data) {
            this.tweets = data;
            this.loading = false;

        } else if (e) {
            console.error('Error fetching data', e);
            this.error=e;
        }   
    }
    get tweetslen() 
    {
        return this.tweets && this.tweets.length === 0;
    }


//Handle ReTweet
    handleRetweet(event) {
        const tweetId = event.target.closest('lightning-card').dataset.id;
        createRetweet({ originalTweetId: tweetId})
            .then(() => {
                alert("Retweeted")// Update UI to reflect retweet (e.g., increment count, display indicator)
            })
            .catch(error => {
                alert(error.body.message);
            });
    }


//Handle Like
    handleLike(event) {
        const tweetId = event.target.closest('lightning-card').dataset.id;
        likeTweet({ tweetId: tweetId})
            .then((data) => {
                if (data)
                {
                    alert('Liked');

                }
                else
                {
                    alert('Disliked');
                }
         
            })
            .catch(error => {
                alert(error.body.message);
            });
}

    async handleComment(event) 
    {  const tweetId = event.target.closest('lightning-card').dataset.id;
        TweetMyComment.open({tweetId:tweetId});
    }

}   