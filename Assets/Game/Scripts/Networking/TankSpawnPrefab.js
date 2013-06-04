var playerPrefab : Transform;

function OnNetworkLoadedLevel ()
{
//	print("on network loaded level");
//	Randomize starting location
	
	var pos : Vector3;
	pos.x = 380+40*Random.value;
	pos.y = 12+Random.value;
	pos.z = 28+40*Random.value;
	Network.Instantiate(playerPrefab, pos, transform.rotation, 0);
	
//	playerPrefab.name = "test";
	
//	print(" this tank name: " + playerPrefab.name);
	
//	pos.x = 20*Random.value;
//	pos.y = 4;
//	pos.z = 20*Random.value;
//	Network.Instantiate(playerPrefab, pos, transform.rotation, 0);

}

function OnPlayerDisconnected (player : NetworkPlayer)
{
	Debug.Log("Server destroying player");
	Network.RemoveRPCs(player, 0);
	Network.DestroyPlayerObjects(player);
}
