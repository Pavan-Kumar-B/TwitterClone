import { LightningElement,wire } from 'lwc';
import  getTweets  from '@salesforce/apex/TweetController.getTweets';
import  createRetweet  from '@salesforce/apex/TweetController.createRetweet';
import likeTweet from '@salesforce/apex/TweetController.likeTweet';
import TweetMyComment from 'c/tweetMyComment';
import  {refreshApex}  from '@salesforce/apex';

export default class TweetFeed extends LightningElement 
{   tweets;
    error;
    loading = true;
    tweetQuery;
   
    @wire(getTweets)
    wiredData(result) 
    {
        this.tweetQuery=result;
        if (result.data) {
            this.tweets = result.data;
            this.loading = false;

        } else if (result.error) {
            console.error('Error fetching data', result.error);
            this.error=result.error;
        }   
    }
    get tweetslen() 
    {
        return this.tweets && this.tweets.length === 0;
    }


//Handle ReTweet
    handleRetweet(event) 
    {
        const tweetId = event.target.closest('lightning-card').dataset.id;
        createRetweet({ originalTweetId: tweetId})
            .then(() => {
                alert("Retweeted");
                return refreshApex(this.tweetQuery);
            })
            .catch(error => {
                alert(error.body.message);
            });
    }


//Handle Like
    handleLike(event) 
    {
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
         return refreshApex(this.tweetQuery);
            })
            .catch(error => {
                alert(error.body.message);
            });
            
}

    async handleComment(event) 
    {  const tweetId = event.target.closest('lightning-card').dataset.id;
        TweetMyComment.open({tweetId:tweetId});
    }
// Refresh the data
     connectedCallback() {
        this.startDataRefresh();
    }

    startDataRefresh() {
        this.refreshInterval = setInterval(() => {
            
            return refreshApex(this.tweetQuery);
        }, 3000);
    }
     disconnectedCallback() {
        clearInterval(this.refreshInterval);
    }
}   