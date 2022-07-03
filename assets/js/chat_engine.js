class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        // this will send the request for connection to the server side
        this.socket=io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self=this;

        this.socket.on('connect', function(){
            console.log('Connection established using sockets!');

            // emitting a join_room event to the server
            self.socket.emit('join_room', {
                user_email : self.userEmail,
                chatroom : 'codeial'
            });

            // detecting a user_joined event emitted in the chatroom
            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            });

        });
    }
}