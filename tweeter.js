
// set up feed with headers
function pageView(){
    return $(`
    <div id="root">
        <section id="header">
            <div class ="title"> 426 Tweeters <i class="fab fa-twitter"></i></div>
            <div>
                <button class="refreshButton button">
                <i class="fas fa-redo-alt"></i> Feed</button>
                <button class="newTweetButton button">
                <i class="fas fa-plus"></i> New Tweet</button>
            </div>
        </section>
        <section id="mainPage">
            <div id="feed">
            </div>
        </section>            
        </div>`);
}

// create feed pull feed
async function pullTweets(){
    let tweets = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });

    // generate tweet set up
    for(let i =0; i < 50; i++){
        let tweet = tweets.data[i];
        $('#feed').append(tweetLayout(tweet));
    }
}

// sets up what each tweet shows
export function tweetLayout(tweet){
    let tweetView = `
    <div class ="tweetView" tweeter="${tweet.id}" id ="${tweet.id}">
    </div>`;

    tweetView += `<div class="singleTweet" tweeter="${tweet.id}">
    <div class="user">Tweeter: ${tweet.author}</div>
    <br>
    <div>${tweet.body}</div>
    <br>
    </div>`;

    if(tweet.isLiked){
        tweetView+= `<button tweeter="${tweet.id}" class="unlikeButton button" type="submit">
        <i class="fas fa-thumbs-down"></i>
        ${tweet.likeCount} Likes</button>` ;
    }
    else{
        tweetView += `<button class="likeButton button " tweeter="${tweet.id}" type ="submit">
        <i class="fas fa-thumbs-up"></i>
        ${tweet.likeCount} Likes </button>`;
    }
    tweetView+=`
    <button class="retweetButton button" tweeter="${tweet.id}" id="${tweet.id}">
    <i class="fas fa-retweet"></i>
    ${tweet.retweetCount} Retweets </button>`;

    tweetView +=`
    <button class="replyButton button" tweeter ="${tweet.id}"> 
    <i class="fas fa-reply"></i>
    ${tweet.replyCount} Replies </button>`;

    if(tweet.isMine){
        tweetView+= `
        <button class="deleteButton button" tweeter ="${tweet.id}">
        <i class="far fa-trash-alt"></i>
        Delete Your Tweet</button>` ;
        tweetView += `
        <button class="editButton button" tweeter ="${tweet.id}">
        <i class="far fa-edit"></i>
        Edit Your Tweet</button>`;
        // let me = tweet.id;
        // console.log(me);
    }

    return tweetView;
}

// compose yo tweet 
export function createTweet(){
    let tweet = `
    <div class= "tweetView">
        <div class ="tweetForm">
            <div class ="user"> New Tweet</div>
            <br>
            <form>
                <textarea row = "2" cols="30" id="tweetBody" placeholder="Hi TA's Tweet Your Truth"></textarea> 
                <footer>
                    <button class="submitButton button" id="tweetSubmit" type="submit">Post Tweet <i class="fas fa-smile-beam"></i>
                    </button>
                    <button class="button" id="cancelButton">Cancel Tweet <i class="far fa-sad-tear"></i></button>
                </footer>
            </form>
        </div>
    </div> `;

    return tweet;
}

// do on click for new tweet
export function handleNewTweet(event){
    event.preventDefault();
    let feed = $('#feed');
    feed.empty();
    feed.append(createTweet());
}

// do on click for submission but
export async function handleSubmissionButton(event){
    event.preventDefault();
    let newBody = $('#tweetBody').val();

    let result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: "" +newBody,
        }
    });
    refreshFeed();
}

// toggle likes
// for like buttons
export async function handleLikingButton(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    //console.log(tweeter);
    const put= await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/'+tweeter+'/like',
        withCredentials: true,
    });
    refreshFeed();
}
// for unlike buttons
export async function handleUnlikingButton(event){
    event.preventDefault();
    let id = event.target.getAttribute('tweeter');
    //console.log(tweeter);
    const put= await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/'+id+'/unlike',
        withCredentials: true,
    });
    refreshFeed();
}


//handle retweets
export async function handleRetweetClick(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    let tweeterId = $("#"+tweeter);
    tweeterId.empty();
    tweeterId.append(makeRetweetForm(tweeter));
}

export function makeRetweetForm(tweeter){
    let retweet = `
    <div class="reweetForm">
    <form>
        <div class="user">Retweet</div>
        <br>
        <textarea rows="3" cols="50" id="retweetBody" placeholder="Quote For Retweet"></textarea>              
        <footer>
            <button class="button" id="submitRetweet" tweeter="${tweeter}" type="submit">Post Retweet</button>
            <button class="button " id="cancel">Cancel Retweet </button>
        </footer>
    </form>
    </div>
    `;
    return retweet;
}

export async function handleRetweetSubmission(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    let updated = $('#retweetBody').val();
    let update= await axios ({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": ""+tweeter,
            "body": ""+updated,
        },
    });
    refreshFeed();
}
export function makeReplyForm(tweeter){
    let replyForm = `
    <div class="replyForm">
    <form>
        <div class="user">Reply</div>
        <br>
        <textarea rows="2" cols="30" id="replyBody" placeholder="What Do You Have To Say?"></textarea>              
        <footer>
            <button class="button" id="submitReply" tweeter="${tweeter}" type="submit">Post Reply</button>
            <button class="button " id="cancel">Cancel Reply</button>
        </footer>
    </form>
    </div>
    `;
    return replyForm;
}

export async function replyClick(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    //let feed = $('#feed');
    // feed.empty();
    // feed.append(makeReplyForm(tweeter));   
    let tweeterId = $("#"+tweeter);
    tweeterId.empty();
    tweeterId.append(makeReplyForm(tweeter));
}

export async function handleReplySubmission(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    let newBody = $('#replyBody').val();

    let result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "reply",
            "parent": tweeter,
            "body": ""+newBody,
        }
    });
    refreshFeed();
}

// create edit form
export function editTweet(tweet){
    let edit =`
    <div class="editForm>
    <div class="user">${tweet.author}</div>
    <br>
        <form>
         <textarea rows="3" cols="30" id="editBody">${tweet.body}</textarea>
         <footer>
             <button class="button" id="submitEdit" tweeter="${tweet.id}" type="submit">Save Edits</button>
             <button class="button" id="cancel">Cancel Edits</button>
          </footer>
        </form>
        </div>
    `;
    return edit;
}

//handle Edit
export async function handleEdit(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    let tweeterId = $("#"+tweeter);
    tweeterId.empty();

    let result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/'+tweeter,
        withCredentials: true,
    });

    tweeterId.append(editTweet(result.data));
}

//handle Edit submit
export async function handleEditSubmit(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    let updatedBody = $('#editBody').val();

    let updated = await axios({
        method:'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/'+tweeter,
        withCredentials: true,
        data: {
            "body": ""+updatedBody,
        },
    });
    refreshFeed();
}

// delete Handling
export async function handleDelete(event){
    event.preventDefault();
    let tweeter = event.target.getAttribute('tweeter');
    let deleted = await axios({
        method: 'delete',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/'+tweeter,
        withCredentials: true,
    });
    refreshFeed();

}

export function handleRefreshButton(event){
    event.preventDefault();
    refreshFeed();
}

export function refreshFeed(){
    let feed = $('#feed');
    feed.empty();
    pullTweets();
}

export async function renderTweets(){
    let pageBody = $('body');

    pageBody.empty();
    pageBody.append(pageView());

    pullTweets();
    pageBody.on('click', '.newTweetButton', handleNewTweet);
    pageBody.on('click', '.refreshButton', handleRefreshButton);
    pageBody.on('click', '.submitButton', handleSubmissionButton);
    pageBody.on('click', '.likeButton', handleLikingButton);
    pageBody.on('click', '.unlikeButton', handleUnlikingButton);
    pageBody.on('click', '.retweetButton', handleRetweetClick);
    pageBody.on('click', '#submitRetweet', handleRetweetSubmission);
    pageBody.on('click', '.replyButton', replyClick);
    pageBody.on('click', '#submitReply', handleReplySubmission);
    pageBody.on('click', '.editButton', handleEdit);
    pageBody.on('click' , '#submitEdit', handleEditSubmit);
    pageBody.on('click', '.deleteButton', handleDelete);

}

$(document).ready(renderTweets());