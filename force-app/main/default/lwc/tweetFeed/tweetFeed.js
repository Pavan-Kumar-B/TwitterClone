import { LightningElement,wire } from 'lwc';
import  getTweets  from '@salesforce/apex/TweetController.getTweets';
import  createRetweet  from '@salesforce/apex/TweetController.createRetweet';
import likeTweet from '@salesforce/apex/TweetController.likeTweet';
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
                alert("You can't retweet your own tweet");
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

                likeButton.label = 'Libked';       }
                else
                {
                    alert('Disliked');
                }
                const button = event.target;
            button.label = tweet.Liked ? 'Unlike' : 'Like';
            button.classList.toggle('liked');
                
                // Update UI to reflect the like:
                // - Increment like count (if applicable)
                // - Display a visual indicator (e.g., "Liked" label)
                // - Consider disabling the like button for the current user
            })
            .catch(error => {
                alert('U can\'like Your post');
                // Handle errors gracefully:
                // - Display an error message to the user
                // - Log the error for debugging
            });
}


}   