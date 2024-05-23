import styled from "styled-components";

export function Loading() {
  return (
    <LoadingContainer>
      <LoadingIcon />
    </LoadingContainer>
  );
}

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 4rem;
  gap: 1rem;
  @media (max-width: 768px) {
    padding: none;
    h1 {
      font-size: x-large;
    }
  }
`;

const LoadingIcon = styled.div`
  width: 8rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #ffa516 94%, #0000) top/8px 8px
      no-repeat,
    conic-gradient(#0000 30%, #ffa516);
  mask-image: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: l13 1s infinite linear;

  @keyframes l13 {
    100% {
      transform: rotate(1turn);
    }
  }
`;
