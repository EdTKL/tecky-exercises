// Declaration of Class and its methods

class Player {
    private strength: number;
    private name: string;
    
    constructor(strength: number, name: string) {
      this.strength = strength;
      this.name = name;
    }
  
    attack(monster: Monster) {
        
        while(monster.getHP() > 0){
            if (Math.random() < 0.8) {
            monster.injure(this.strength)
            console.log (`Player ${this.name} attacks a ${monster.name} (HP:${monster.getHP()})`)
            } else {
                monster.injure(this.strength * 1.5)
            console.log (`Player ${this.name} attacks a ${monster.name} (HP:${monster.getHP()})[CRITICAL]`)
            }
        }
    }

    gainExperience(exp: number) {
        this.strength += exp
    }
}

  class Monster {
    // Think of how to write injure
    private hp: number;
    public name: string;

    constructor(hp: number, name: string) {
        this.hp = hp;
        this.name = name;
      }

    getHP():number{
        return this.hp
    }

    injure(damge: number) {
            this.hp = Math.max(this.hp - damge, 0);

    }
  }
  
  // Invocations of the class and its methods
  const player = new Player(20, "Peter");

  const monster = new Monster(100, "monster");

  player.attack(monster);
  // English counterpart: Player attacks monster