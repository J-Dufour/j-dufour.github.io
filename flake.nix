{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};

      nativeBuildInputs = with pkgs; [
        nodejs_24

      ];
    in
    {

      devShells.${system}.default = pkgs.mkShell {
        packages = nativeBuildInputs;

      };

    };
}
