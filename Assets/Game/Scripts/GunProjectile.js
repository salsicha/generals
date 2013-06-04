var timeOut = 1.0;
var detachChildren = false;
var explosion : GameObject; 
var damage = 1;
//gameObject.tag = "bullet";

function OnCollisionEnter (collision : Collision) 
{ 

//	if (Network.player != collision.gameObject.networkView.group)
//	{

//		print("projectile collision with enemy");
		
//		print("other player health: " + collision.gameObject.tankHealth);

//		collision.gameObject.GetComponent("Vehicle").tankHealth -= 22;

//		print("other player health: " + collision.gameObject.GetComponent("Vehicle").tankHealth);

//		print(collision.gameObject.tag);

// 		only explode if the collision is with a networked item and the networked item recognizes the collision
//		if (networkView.isMine)
//		{

//		} else
//		{

//	if (Network.isServer)
//	{
		var contact : ContactPoint = collision.contacts[0]; 
		var rotation = Quaternion.FromToRotation(Vector3.up, contact.normal); 
		var instantiatedExplosion : GameObject = Network.Instantiate (explosion, contact.point, rotation, 0); 
		Destroy(gameObject); 
//	}
	
//		}
//	}

} 



function Awake ()
{
	Invoke("DestroyNow", timeOut);
}

function DestroyNow ()
{
	if (detachChildren) {
		transform.DetachChildren ();
	}
	
	DestroyObject (gameObject);
}

//function OnTriggerEnter(other:Collider)
//{
//		if(other.gameObject.CompareTag("Enemy"))
//		{ 
//			other.gameObject.SendMessage("OnDamage", damage);
//		}
//}
