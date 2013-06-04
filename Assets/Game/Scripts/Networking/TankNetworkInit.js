function OnNetworkInstantiate (msg : NetworkMessageInfo) {
	// This is our own player
	
	print(" this network group: " + this.networkView.group);

//	print("my network message: " + msg);
	
	print(" this network player: " + Network.player);
	
	if (Network.isServer)
	{
		print("is server");
	} else
	{
		print("is client");
	}

	if (networkView.isMine)
	{
//		print("our player");
//		Camera.main.SendMessage("SetTarget", transform);
		GetComponent("NetworkRigidbody").enabled = false;
	}
	// This is just some remote controlled player, don't execute direct
	// user input on this
	else
	{
//		print("remote player");
		name += "Remote";
//		GetComponent(Vehicle).SetEnableUserInput(false);
		GetComponent("NetworkRigidbody").enabled = true;
	}
}